from config import db

class CodeFiles(db.Model):
  __tablename__ = "code_files"
  file_id = db.Column(db.Integer, primary_key=True)
  file_content = db.Column(db.String)

  def to_json(self):
    return {
      "file_id": self.file_id,
      "file_content": self.file_content
    }
  
