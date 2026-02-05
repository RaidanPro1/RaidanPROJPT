# backend/cli/raidan_ai/cli.py
import os
import sys
import argparse
import subprocess
import google.generativeai as genai
from pathlib import Path

def get_system_context() -> str:
    """Gathers system information to provide context to the AI model."""
    try:
        uname = subprocess.check_output(["uname", "-a"], text=True).strip()
        docker_ps = subprocess.check_output(["docker", "ps", "--format", "table {{.Names}}\t{{.Image}}\t{{.Status}}"], text=True).strip()
        context = f"## System Context ##\n- OS Info: {uname}\n- Running Containers:\n{docker_ps}\n"
        return context
    except (FileNotFoundError, subprocess.CalledProcessError) as e:
        return f"## System Context ##\n- Warning: Could not gather full context. Error: {e}\n"

def configure_gemini():
    """Configures the Gemini API."""
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("\x1b[31mError: GEMINI_API_KEY environment variable not set.\x1b[0m", file=sys.stderr)
        sys.exit(1)
    genai.configure(api_key=api_key)

def handle_ask(args):
    """Handles the 'ask' subcommand."""
    system_context = get_system_context()
    prompt = f"""
    {system_context}
    
    ## User Request ##
    Role: You are a senior Linux systems administrator and DevOps expert.
    Task: Provide a concise, single-line shell command to accomplish the user's request.
    Follow it with a brief, one-sentence explanation prefixed with "# Explanation:".
    
    User's request: "{args.prompt}"
    
    Response:
    """
    
    model = genai.GenerativeModel('gemini-3-pro-preview')
    response = model.generate_content(prompt)
    print("\x1b[36m# Suggested Command:\x1b[0m")
    print(response.text.strip())

def handle_fix(args):
    """Handles the 'fix' subcommand."""
    log_file = Path(args.logfile)
    if not log_file.is_file():
        print(f"\x1b[31mError: Log file not found at '{log_file}'\x1b[0m", file=sys.stderr)
        return

    try:
        log_content = subprocess.check_output(["tail", "-n", "50", str(log_file)], text=True).strip()
    except subprocess.CalledProcessError as e:
        print(f"\x1b[31mError reading log file: {e}\x1b[0m", file=sys.stderr)
        return
        
    system_context = get_system_context()
    prompt = f"""
    {system_context}
    
    ## User Request ##
    Role: You are an expert in troubleshooting server applications (Nginx, Docker, PostgreSQL).
    Task: Analyze the following log snippet, identify the root cause of the error, and suggest a specific command or action to fix it.
    
    Log file snippet from '{args.logfile}':
    ---
    {log_content}
    ---
    
    Analysis and Solution:
    """

    model = genai.GenerativeModel('gemini-3-pro-preview')
    response = model.generate_content(prompt)
    print("\x1b[33m# AI Analysis & Suggested Fix:\x1b[0m")
    print(response.text.strip())


def handle_gen(args):
    """Handles the 'gen' subcommand."""
    system_context = get_system_context()
    prompt = f"""
    {system_context}
    
    ## User Request ##
    Role: You are a proficient scriptwriter for shell (bash) and Python.
    Task: Generate a complete, executable script to accomplish the user's request. Add comments to explain key parts of the script. The script should be ready to be piped to a file and executed.
    
    User's request: "generate a {args.script_description}"
    
    Generated Script:
    """
    
    model = genai.GenerativeModel('gemini-3-pro-preview')
    response = model.generate_content(prompt)
    
    # Simple syntax highlighting for the output
    highlighted_text = response.text.strip()
    highlighted_text = highlighted_text.replace("#", "\x1b[32m#") # Comments green
    highlighted_text = highlighted_text.replace("echo", "\x1b[35mecho\x1b[0m") # Keywords purple
    highlighted_text = highlighted_text.replace("for", "\x1b[35mfor\x1b[0m")
    highlighted_text = highlighted_text.replace("do", "\x1b[35mdo\x1b[0m")
    highlighted_text = highlighted_text.replace("done", "\x1b[35mdone\x1b[0m")

    print("\x1b[36m# Generated Script:\x1b[0m")
    print(highlighted_text)


def main():
    """Main function to parse arguments and dispatch to handlers."""
    configure_gemini()
    
    parser = argparse.ArgumentParser(description="Raidan AI Assistant for the Sovereign Terminal.")
    subparsers = parser.add_subparsers(dest="command", required=True, help="Available commands")

    # 'ask' command
    parser_ask = subparsers.add_parser("ask", help="Ask for a command suggestion.")
    parser_ask.add_argument("prompt", type=str, help="The task you want to accomplish.")
    parser_ask.set_defaults(func=handle_ask)

    # 'fix' command
    parser_fix = subparsers.add_parser("fix", help="Analyze a log file and suggest a fix.")
    parser_fix.add_argument("logfile", type=str, help="Path to the log file to analyze.")
    parser_fix.set_defaults(func=handle_fix)

    # 'gen' command
    parser_gen = subparsers.add_parser("gen", help="Generate a complete script.")
    parser_gen.add_argument("script_description", type=str, help="A description of the script to generate.")
    parser_gen.set_defaults(func=handle_gen)
    
    if len(sys.argv) == 1:
        parser.print_help(sys.stderr)
        sys.exit(1)

    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
