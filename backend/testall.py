from test_script import test_script
import json

def test_all(jsonarray):
  incorrectCases = []
  for item in jsonarray:
    # item = json.loads(itemJson)
    comm = item["algorithm"]
    opt = item["solution"]
    subopt = item["incorrect solution"]

    result = test_script(opt)
    if (not result["success"]):
      print("answer for case: " + comm + " is incorrect: fix it in the future")
      incorrectCases.append(item)

    print("code outputted: " + result["output"])



  return incorrectCases
  



print(test_all([{
        "algorithm": "Find the first non-repeating character in a string.",
        "solution": "def first_non_repeating(s):\n    for char in s:\n        if s.count(char) == 1:\n            return char\n    return None",
        "incorrect solution": "def first_non_repeating(s):\n    # Incorrect: returns the last non-repeating character instead\n    result = None\n    for char in s:\n        if s.count(char) == 1:\n            result = char\n    return result"
      },
      {
        "algorithm": "Check if two numbers are co-prime.",
        "solution": "def are_coprime(a, b):\n    def gcd(a, b):\n        while b:\n            a, b = b, a % b\n        return a\n    return gcd(a, b) == 1",
        "incorrect solution": "def are_coprime(a, b):\n    # Incorrect: uses sum of numbers instead of gcd\n    return (a + b) == 1"
      },
      {
        "algorithm": "Convert a list of strings into a single string joined by spaces.",
        "solution": "def join_strings(lst):\n    return ' '.join(lst)",
        "incorrect solution": "def join_strings(lst):\n    # Incorrect: joins with commas instead of spaces\n    return ','.join(lst)"
      },
      {
        "algorithm": "Count the number of words in a string.",
        "solution": "def word_count(s):\n    return len(s.split())",
        "incorrect solution": "def word_count(s):\n    # Incorrect: splits by characters rather than words\n    return len(list(s))"
      },]))



