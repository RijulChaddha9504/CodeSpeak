import copy

indentable_syntax = python_indentation_syntax = [
    # Control Flow
    "if",
    "elif",
    "else",
    "for",
    "while",
    "try",
    "except",
    "finally",

    # Definitions
    "def",
    "class",

    # Context Managers
    "with",
    "async",

    # Structural Pattern Matching (Python 3.10+)
    "match",
    "case",
]

# parse the given string of python code into matrix form, 
# indents will be indicated with i-[type]
def parse_code_to_matrix(code_string, tabspacing):
  lines_list = code_string.split("\n")
  result_matrix = []
  indent_levels = []
  for line_num, line in enumerate(lines_list):
    numspaces = 0
    while (line[numspaces] == " "):
      numspaces += 1
    num_indents = numspaces // tabspacing
    while (num_indents < len(indent_levels)):
      indent_levels.pop(-1)

    clean_line = line.strip()
    parsed_line = copy.deepcopy(indent_levels)
    parsed_line.append(clean_line)
    
    syntax_list = clean_line.split(" ")
    if (syntax_list[0] in indentable_syntax):
      indent_levels.append("i-" + syntax_list[0])
    result_matrix.append(parsed_line)
  
  return result_matrix


'''
t1 = "def is_prime(n):\n  if n <= 1:\n    return False\n  for i in range(2, int(n**0.5) + 1):\n    if n %% i == 0:\n      return False\n  return True"
print(parse_code_to_matrix(t1, 2))'
'''