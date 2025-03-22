from test_script import test_script
import json

def test_all(jsonarray):
  for item in jsonarray:

    comm = item.command
    opt = item.optimal_solution
    subopt = item.suboptimal_solution

