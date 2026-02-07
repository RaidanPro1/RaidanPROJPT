# backend/agents/investigator.py
# The brain of the Autonomous Investigative Agent, built with LangGraph.
# Author: Lead AI Architect, RaidanPro OS (v4.5)

import os
from typing import TypedDict, List, Annotated
from langgraph.graph import StateGraph, END
from langchain_community.llms import Ollama
from neo4j import GraphDatabase
from qdrant_client import QdrantClient

# --- Configuration ---
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "sovereign_password"
QDRANT_HOST = "localhost"
QDRANT_PORT = 6333

# --- Initialize Connections ---
llm = Ollama(model="qwen2.5-sovereign", base_url=OLLAMA_HOST)
neo4j_driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
qdrant_client = QdrantClient(host=QDRANT_HOST, port=QDRANT_PORT)

# --- Agent State Definition ---
class AgentState(TypedDict):
    """Defines the state of our agent graph."""
    query: str
    plan: List[str]
    documents: List[str]
    graph_data: List[dict]
    final_answer: str
    critique: str

# --- Agent Nodes ---

def planner_node(state: AgentState) -> AgentState:
    """Generates a step-by-step plan to answer the user's query."""
    print(">> Node: Planner")
    prompt = f"""
    Role: You are an expert investigative journalist.
    Task: Create a step-by-step plan to investigate the following complex query.
    The plan should involve searching for documents and querying a graph database of entities.
    Query: "{state['query']}"
    
    Output a numbered list of steps.
    Example:
    1. Search for documents related to 'Marib Dam budget'.
    2. Identify key persons and companies from the documents.
    3. Query the graph database to find relationships between these entities.
    4. Synthesize the findings into a report.
    """
    plan_str = llm.invoke(prompt)
    plan_list = [step.strip() for step in plan_str.split('\n') if step.strip()]
    return {"plan": plan_list}

def hyde_node(state: AgentState) -> AgentState:
    """Generates a hypothetical document for better vector retrieval (HyDE)."""
    print(">> Node: HyDE Query Rewriter")
    prompt = f"Generate a detailed, hypothetical news article answering this query: '{state['query']}'. This will be used for a semantic search."
    hypothetical_doc = llm.invoke(prompt)
    # The rewritten query is the hypothetical document itself for embedding
    return {"query": hypothetical_doc} 

def graph_hunter_node(state: AgentState) -> AgentState:
    """Generates and executes a Cypher query to search the Neo4j graph."""
    print(">> Node: Graph Hunter")
    prompt = f"""
    Role: You are a Neo4j expert.
    Task: Based on the query '{state['query']}', generate a Cypher query to find relevant entities and relationships.
    Schema: Nodes can be (:Person), (:Organization), (:Location). Relationships can be [:FAMILY], [:WORKS_FOR], [:LOCATED_IN].
    
    Example for "Who is related to Ahmed Ali?": MATCH (p1:Person {{name: "Ahmed Ali"}})-[r:FAMILY]-(p2:Person) RETURN p1, r, p2
    
    Generate only the Cypher query.
    """
    cypher_query = llm.invoke(prompt)
    print(f"   - Generated Cypher: {cypher_query}")
    
    graph_results = []
    try:
        with neo4j_driver.session() as session:
            result = session.run(cypher_query)
            graph_results = [record.data() for record in result]
    except Exception as e:
        print(f"   - Neo4j Error: {e}")
        return {"graph_data": [{"error": str(e)}]}
        
    return {"graph_data": graph_results}

def vector_hunter_node(state: AgentState) -> AgentState:
    """Searches the Qdrant vector database for relevant documents."""
    print(">> Node: Vector Hunter")
    
    # Use Ollama to get the embedding for the (potentially rewritten) query
    embedding = Ollama(model="nomic-embed-text", base_url=OLLAMA_HOST).embed_query(state['query'])
    
    search_results = qdrant_client.search(
        collection_name="raidan_docs",
        query_vector=embedding,
        limit=5
    )
    
    documents = [hit.payload['content'] for hit in search_results]
    return {"documents": documents}

def synthesizer_node(state: AgentState) -> AgentState:
    """Synthesizes information from documents and graph data into a final answer."""
    print(">> Node: Synthesizer")
    context = "## Retrieved Documents ##\n" + "\n---\n".join(state.get("documents", []))
    context += "\n\n## Retrieved Graph Relationships ##\n" + "\n".join([str(item) for item in state.get("graph_data", [])])
    
    prompt = f"""
    Role: You are an intelligence analyst.
    Task: Based on the provided context below, write a comprehensive and objective report answering the original query: '{state['query']}'
    Context:
    {context}
    
    Final Report:
    """
    final_answer = llm.invoke(prompt)
    return {"final_answer": final_answer}

def sovereign_critic_node(state: AgentState) -> AgentState:
    """Checks if the final answer complies with the sovereign system prompt."""
    print(">> Node: Sovereign Critic")
    system_prompt = "You must adhere to Yemeni law. Do not reveal sensitive personal information or incite conflict. Be objective." # Simplified
    
    prompt = f"""
    System Doctrine: "{system_prompt}"
    Generated Answer: "{state['final_answer']}"
    
    Task: Does the generated answer violate the system doctrine? 
    Answer with only "yes" or "no", followed by a one-sentence explanation.
    """
    critique = llm.invoke(prompt)
    return {"critique": critique}

def should_continue(state: AgentState) -> str:
    """Router function to decide the next step."""
    if state.get("critique", "").lower().startswith("yes"):
        return "end_failure"
    return "end_success"

# --- Build the Graph ---
workflow = StateGraph(AgentState)

workflow.add_node("planner", planner_node)
workflow.add_node("hyde_rewriter", hyde_node)
workflow.add_node("graph_searcher", graph_hunter_node)
workflow.add_node("vector_searcher", vector_hunter_node)
workflow.add_node("synthesizer", synthesizer_node)
workflow.add_node("critic", sovereign_critic_node)

# --- Define Edges ---
workflow.set_entry_point("planner")
workflow.add_edge("planner", "hyde_rewriter")
workflow.add_edge("hyde_rewriter", "vector_searcher")
workflow.add_edge("planner", "graph_searcher") # Run in parallel

# After searching, results go to the synthesizer
workflow.add_edge("vector_searcher", "synthesizer")
workflow.add_edge("graph_searcher", "synthesizer")

workflow.add_edge("synthesizer", "critic")

# Conditional end based on critique
workflow.add_conditional_edges(
    "critic",
    should_continue,
    {
        "end_success": END,
        "end_failure": END  # Can be routed to a "rewrite" node in a more complex graph
    }
)

# Compile the agent
investigative_agent = workflow.compile()

# --- Example Usage ---
def run_investigation(query: str):
    """Entry point to run the agent."""
    inputs = {"query": query}
    final_state = investigative_agent.invoke(inputs)

    print("\n--- INVESTIGATION COMPLETE ---")
    if final_state.get("critique", "").lower().startswith("yes"):
        print("Final Answer FAILED Sovereign Critique:")
        print(f"   Reason: {final_state['critique']}")
    else:
        print("Final Report:")
        print(final_state.get("final_answer", "No answer could be generated."))

if __name__ == '__main__':
    # This is for direct testing of the script
    test_query = "Reveal corruption links related to the Marib Dam project and its key personnel."
    run_investigation(test_query)
