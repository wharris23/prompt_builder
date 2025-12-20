1. Project Overview
The Prompt Compiler is a development-time infrastructure designed to transform underspecified or low-quality user inputs into high-quality, structured prompts optimized for Large Language Models (LLMs). The system functions as a static compiler: it maps user intent to pre-defined, optimized prompt structures.

At runtime, the system acts as a pure transformation layer. It accepts a raw input string and outputs a refined prompt string. It does not generate the final answer to the user's query; it only optimizes the instruction set that will be sent to a downstream model.

2. Design Philosophy
Prompt Compiler, Not Prompt Runtime: The intelligence of the system is "baked in" during the development phase. The runtime should be a lightweight, deterministic execution engine.
Zero-Cost Runtime: The system must avoid all runtime dependencies on paid LLM APIs. Optimization logic must be executable locally or via free-tier, open-weight models.
Transparency and Explainability: Every transformation from raw input to optimized prompt must be traceable to specific templates or heuristic rules.
Agnosticism: The output prompts should be structured to work across various open-weight models (e.g., Mistral, Llama, Phi) with minimal platform-specific coupling.
3. System Architecture
The architecture is strictly divided between the Development Environment and the Runtime Environment.

Development-Time (Intelligence Layer)
Agent: Claude Opus 4.5 (via Google Antigravity).
Process: Claude analyzes intent domains, generates recursive prompt templates, defines classification heuristics, and optimizes the system's internal logic.
Artifacts: YAML/JSON template files, Regex-based intent classifiers, and deterministic decision trees committed to the repository.
Runtime (Execution Layer)
Environment: Local machine or browser-based target.
Dependencies: Lightweight, free models (e.g., Gemma-2b, Phi-3 via WebLLM or local Ollama instance).
Process:
Receive input.
Classify intent using deterministic rules or a small local model.
Select and populate the corresponding pre-generated template.
Output the finalized prompt string.
4. Claude Opus 4.5 Responsibilities
Claude Opus 4.5 acts as the System Designer and Compiler. Its outputs are code and configuration artifacts, not runtime inferences.

Generation Tasks
Template Engineering: Design complex, multi-variable prompt templates that follow industry best practices (Chain-of-Thought, Few-Shot, Delimiters).
Intent Logic: Generate the rule sets (Regex, Keyword maps) or the training data/instructions for shallow runtime classifiers.
Heuristic Definition: Define the logic for input sanitization, length constraints, and variable injection.
Constraint Adherence
Claude must never assume it will be available to answer a question at runtime.
Claude must optimize for "free-model" compatibility, assuming the runtime model may have lower reasoning capabilities than itself.
Claude must prioritize code-based or rule-based logic over "LLM-in-the-loop" logic for the runtime.
5. Runtime Responsibilities
The runtime environment is responsible for the mechanical assembly of the prompt.

Deterministic Execution: Mapping inputs to templates must be predictable.
Local Inference: If an LLM is required for classification, it must be a free, local model (e.g., Mistral-7B or smaller).
String Manipulation: Final assembly of variables into the selected template.
Performance: Transformations should occur in <500ms to ensure a seamless experience.
6. Prompt Template System
The system utilizes a structured templating language (e.g., Handlebars or Jinja2) to maintain separation between logic and content.

Structure: Templates include system instructions, context windows, and placeholder variables for user input.
Versioning: Every template artifact must be versioned. Optimization updates from Claude are treated as code deployments.
Safety: Templates must include guardrails to prevent prompt injection or leakage of the optimization logic itself.
7. Intent Parsing Strategy
The system prioritizes non-LLM approaches to minimize cost and latency.

Level 1 (Regex/Keyword): Fast, deterministic matching for high-confidence intents.
Level 2 (Decision Trees): Logic-based routing based on input metadata (e.g., length, language, presence of code).
Level 3 (Lightweight Classifier): If Level 1 and 2 fail, a small local embedding model or a <3B parameter LLM may be used to categorize the input into a known template bucket.
8. Non-Goals
No Auto-Answering: The application must never answer the user's question; it only prepares the question for another model.
No Hidden Paid Inference: No calls to OpenAI, Anthropic (at runtime), or any other metered API.
No Opaque Mutation: The system should not "guess" how to change a prompt without a pre-defined template or rule generated during development.
9. Guidelines for Future Expansion
Domain Packs: The architecture should allow for "plug-and-play" prompt packs (e.g., "Coding Pack", "Creative Writing Pack") consisting of new templates and intent rules.
Model-Specific Optimization: Future iterations may include logic to fork templates based on the detected runtime target (e.g., adjusting the prompt for Llama-3 vs. Mistral).
Community Contribution: Logic should be stored in human-readable formats (YAML) to allow developers to manually tune Claude-generated artifacts.