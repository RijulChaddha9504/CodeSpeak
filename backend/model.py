from config import db

class CodeFiles(db.Model):
  __tablename__ = "code_files"
  file_id = db.Column(db.Integer, primary_key=True)
  file_prompt = db.Column(db.String(500))
  file_content = db.Column(db.String(1000))

  def to_json(self):
    return {
      "file_id": self.file_id,
      "file_prompt": self.file_prompt,
      "file_content": self.file_content
    }
  
