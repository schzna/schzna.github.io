from pathlib import Path
import frontmatter
from datetime import date

def main():
	root = Path(__file__).parent
	src = root/"__old"/"_posts"
	dest = root/"content"/"posts"
	for f in src.iterdir():
		post = frontmatter.loads(f.read_text(encoding="utf-8"))
		meta = post.metadata
		post.metadata["categories"] = post.metadata["categories"].split()
		post.metadata["params"] = {
			"author" : post.metadata["author"].lower(),
		}
		post.metadata["date"] = date(*[ int(s) for s in f.stem.split("-")[:-1] ])
		post.metadata.pop("author")
		open(dest/f.name, "w", encoding="utf-8").write(frontmatter.dumps(post))

if __name__ == "__main__":
	main()