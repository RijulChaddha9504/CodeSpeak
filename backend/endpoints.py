from flask import request, jsonify
from config import app, db
from model import CodeFiles


@app.route("/get-code/<int:user_id>", methods = ["GET"])
def get_user_code(user_id):
  code_string = CodeFiles.query.get(user_id)
  if not code_string:
      return jsonify({'message': 'CodeFile not found'}), 404
  return code_string.to_json()


@app.route("/set-code/<int:user_id>", methods = ["POST"])
def set_user_code(user_id):
  code_string = CodeFiles.query.get(user_id)
  data = request.json
  code_string.file_content = data.get("file_content", code_string.file_content)
  db.session.commit()
  return jsonify({"message": "set successful"})



if (__name__ == "__main__"):
  with app.app_context():
    db.create_all()
  app.run(debug=True)