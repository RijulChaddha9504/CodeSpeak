from parse_code import parse_code_to_matrix
from flask import request, jsonify
from config import app, db
from model import CodeFiles

# FOR BACKEND: Get user code returns the code last generated by the user
@app.route("/get-code/<int:user_id>", methods = ["GET"])
def get_user_code(user_id):
  code_string = CodeFiles.query.get(user_id)
  if not code_string:
      return jsonify({'message': 'CodeFile not found'}), 404
  return code_string.to_json()

# FOR BACKEND: Sets user code returns the code last generated by the user
# This does not contain the parsed code, only raw string code data
@app.route("/set-code/<int:user_id>", methods = ["POST"])
def set_user_code(user_id):
  code_string = CodeFiles.query.get(user_id)
  data = request.json
  print(data)
  if code_string: 
    prev_code = code_string.file_content
    code_string.file_content = data.get("file_content", prev_code)
  else: 
    db.session.add(CodeFiles(file_id=user_id, file_content=data.get("file_content", "")))
  db.session.commit()
  return jsonify({"message": "set successful"})


# FOR FRONTEND: 
@app.route("/get-parsed-code/<int:user_id>", methods = ["GET"])
def get_parsed_code(user_id): 
  code_string = CodeFiles.query.get(user_id)
  if not code_string:
    return jsonify({'message': 'CodeFile not found'}), 404
  return jsonify({"parsed_code": parse_code_to_matrix(code_string.file_content, 2)})


@app.route("/post-prompt/<int:user_id>", methods = ["PATCH"])
def post_prompt(user_id):
  profile=CodeFiles.query.get(user_id)
  if (profile):
    data = request.json
    profile.file_prompt = data.get("prompt", profile.file_prompt)
    db.session.commit()
    return jsonify({"message": "updated prompt"})
  else:
    jsonify({"message": "profile not found"})

if (__name__ == "__main__"):
  with app.app_context():
    db.create_all()
  app.run(debug=True)