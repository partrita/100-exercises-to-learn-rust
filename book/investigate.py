import os
import re

def check_files(dir_path):
    k_char = re.compile(r'[가-힣]')
    literal_n = re.compile(r'\\n')
    
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            if file.endswith('.md'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Task 3: literal \n
                    if '\\n' in content:
                        print(f"LITERAL \\n in {path}")
                    
                    # Task 1: Word split [가-힣]\n[가-힣]
                    # Matches Korean char followed by single newline and Korean char
                    matches = re.findall(r'([가-힣])\n([가-힣])', content)
                    if matches:
                        print(f"WORD SPLIT in {path}: {matches[:5]}")
                    
                    # Task 2: Forced line break candidates
                    # Lines that end with Korean char and are followed by a line that is NOT blank and NOT a list/header
                    lines = content.split('\n')
                    for i in range(len(lines) - 1):
                        line = lines[i]
                        next_line = lines[i+1]
                        if line.endswith('  '): # already has forced break
                            continue
                        if k_char.search(line) and next_line.strip() and not next_line.startswith(('#', '-', '*', '1.', '>', '```')):
                            # This is a candidate for Task 2 or Task 1
                            pass

if __name__ == "__main__":
    check_files('src')
