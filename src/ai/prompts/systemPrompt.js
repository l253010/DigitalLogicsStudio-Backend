const CURRICULUM = [
  { slug: "boolean-algebra", title: "Boolean Algebra", summary: "gates, expressions, simplification, De Morgan's laws" },
  { slug: "number-systems", title: "Number Systems", summary: "binary, octal, hex, BCD, conversions" },
  { slug: "arithmetic-circuits", title: "Arithmetic Circuits", summary: "half adder, full adder, subtractor, comparator" },
  { slug: "memory", title: "Memory", summary: "latches, flip-flops, registers, RAM/ROM" },
  { slug: "sequential-circuits", title: "Sequential Circuits", summary: "FSMs, counters, shift registers" },
];

const COAL_CURRICULUM = [
  { slug: "intro-computer-organization", title: "Intro to Computer Organization", summary: "organization vs architecture, Von Neumann model, CPU and buses" },
  { slug: "number-systems-representation", title: "Number Systems & Representation", summary: "binary/hex conversion, complements, BCD, ASCII, floating-point basics" },
  { slug: "digital-logic-bridge", title: "Digital Logic Bridge", summary: "gates, adders, flip-flops, and registers in CPU context" },
  { slug: "cpu-components", title: "CPU Components", summary: "ALU, control unit, PC, IR, and general-purpose registers" },
  { slug: "instruction-cycle", title: "Instruction Cycle", summary: "fetch, decode, execute, writeback, and program tracing" },
  { slug: "memory-hierarchy", title: "Memory Hierarchy", summary: "registers, cache, RAM, addressing, stack preview" },
  { slug: "instruction-set-architecture", title: "Instruction Set Architecture", summary: "instruction categories, formats, assembly vs machine code" },
  { slug: "addressing-modes", title: "Addressing Modes", summary: "immediate, register, direct, indirect, indexed addressing" },
  { slug: "flags-and-status", title: "Flags & Comparisons", summary: "ZF, CF, OF, SF, CMP, and conditional branches" },
  { slug: "coal-syntax", title: "Data Movement & Instructions", summary: "MOV, arithmetic, logic, shift, and COAL syntax" },
  { slug: "control-flow", title: "Control Flow", summary: "jumps, loops, if-else, and branch patterns" },
  { slug: "registers-memory", title: "Registers & Memory Operands", summary: "x86 register sets, operand sizes, memory access rules" },
  { slug: "procedures-stack", title: "Procedures & Stack", summary: "PUSH, POP, CALL, RET, parameters, and recursion" },
  { slug: "arrays-strings", title: "Arrays & Strings", summary: "indexed access, string instructions, sort and search routines" },
  { slug: "ia32-architecture", title: "Intel IA-32 Architecture", summary: "modes, segmentation, paging, instruction encoding" },
  { slug: "directives-macros", title: "Directives & Macros", summary: ".DATA, .CODE, PROC, macros, assemble-link pipeline" },
  { slug: "hw-sw-interface", title: "Hardware–Software Interface", summary: "compiler chain, stack frames, calling conventions" },
  { slug: "io-interrupts", title: "I/O & Interrupts", summary: "programmed I/O, interrupts, DMA, and ISRs" },
  { slug: "processor-families", title: "Processor Families", summary: "CISC vs RISC, x86, ARM, MIPS, RISC-V comparison" },
  { slug: "pipelining", title: "Pipelining & Hazards", summary: "5-stage pipeline, hazards, forwarding, performance metrics" },
  { slug: "computer-organization", title: "COAL Capstone", summary: "end-to-end integration, exams, and project prep" },
];

const VALID_DIFFICULTIES = ["beginner", "intermediate", "advanced"];

function titleCase(slug = "") {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function describeTopic(slug, course = "DLS") {
  if (!slug) return null;
  const list = course === "COAL" ? COAL_CURRICULUM : CURRICULUM;
  const known = list.find((t) => t.slug === slug);
  return known ? `${known.title} (${known.summary})` : titleCase(slug);
}

function buildDualCurriculumBlock() {
  const dld = CURRICULUM.map((t, i) => `${i + 1}. ${t.title} (${t.summary})`).join("\n");
  const coal = COAL_CURRICULUM.map((t, i) => `${i + 1}. ${t.title} (${t.summary})`).join("\n");
  return `Digital Logic Design (DLS):\n${dld}\n\nCOAL / Computer Organization:\n${coal}`;
}

function buildSystemPrompt({ user, context = {} } = {}) {
  const {
    name: contextName,
    currentCourse,
    currentTopic,
    recentTopics = [],
    toolsUsed = [],
    difficulty,
  } = context || {};

  const name = (user && user.name) || contextName || "there";
  const normalizedCourse = String(currentCourse || "").toUpperCase() === "COAL" ? "COAL" : "DLS";
  const currentTopicDescription = describeTopic(currentTopic, normalizedCourse) || "Not specified";

  const recentTopicsLine =
    Array.isArray(recentTopics) && recentTopics.length
      ? recentTopics.map((t) => describeTopic(t, normalizedCourse) || titleCase(t)).join(" → ")
      : "None yet";

  const toolsLine =
    Array.isArray(toolsUsed) && toolsUsed.length
      ? toolsUsed.map(titleCase).join(", ")
      : "None yet";

  const normalizedDifficulty = VALID_DIFFICULTIES.includes(difficulty) ? difficulty : "intermediate";

  const difficultyGuidance = {
    beginner: "Explain fundamentals carefully, define terms the first time you use them, and avoid jumping ahead.",
    intermediate: "Skip trivial basics, but do not assume graduate-level prior knowledge.",
    advanced: "Move quickly, use precise technical vocabulary, and feel free to reference edge cases or optimization tradeoffs.",
  }[normalizedDifficulty];

  return `You are DLS Mentor, an expert teaching assistant for Digital Logic Studio (DLS)
and the COAL learning track (Computer Organization and Assembly Language).

Student profile:
- Name: ${name}
- Active course: ${normalizedCourse}
- Current topic: ${currentTopicDescription}
- Recently studied: ${recentTopicsLine}
- Tools used this session: ${toolsLine}
- Difficulty level: ${normalizedDifficulty.charAt(0).toUpperCase() + normalizedDifficulty.slice(1)}

Platform curriculum scope:
${buildDualCurriculumBlock()}

Persona and tone:
- Speak directly to ${name} by name when it feels natural, but don't force it into every sentence.
- ${difficultyGuidance}
- Use concrete examples, truth tables, and circuit analogies for DLS topics.
- For COAL topics, use clear instruction examples, register/memory explanations, and step-by-step execution flow.
- If the question fits the other course better, answer helpfully and mention which track it belongs to.
- If the question is outside digital logic and computer organization, politely redirect back to the curriculum.
- Keep answers concise but complete. Prefer numbered steps for procedures.`;
}

module.exports = { buildSystemPrompt, CURRICULUM, COAL_CURRICULUM };
