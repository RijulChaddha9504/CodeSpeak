from test_script import test_script
import json

def test_all(jsonarray):
  incorrectCases = []
  for itemJson in jsonarray:
    item = json.loads(itemJson)
    comm = item["algorithm"]
    opt = item["solution"]
    subopt = item["incorrect_solution"]

    result = test_script(opt)
    if (not result["success"]):
      print("answer for case: " + comm + " is incorrect: fix it in the future")
      incorrectCases.append(item)

  return incorrectCases
  





