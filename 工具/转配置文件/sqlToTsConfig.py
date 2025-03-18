import os
import re
import glob


def convert_to_camel_case(snake_case):
    """Convert snake_case to camelCase"""
    components = snake_case.split('_')
    return components[0] + ''.join(x.title() for x in components[1:])


def extract_table_info(sql_content):
    """Extract field names and comments from SQL CREATE TABLE statement"""
    # Extract table name
    table_name_match = re.search(
        r'CREATE\s+TABLE\s+`?(\w+)`?', sql_content, re.IGNORECASE)
    if not table_name_match:
        return None, []

    table_name = table_name_match.group(1)

    # Extract fields and comments by processing each line
    fields = []

    # Split SQL content into lines and process each line
    for line in sql_content.split('\n'):
        line = line.strip().rstrip(',')  # Clean up line endings

        # Skip lines that don't look like field definitions
        if not line.startswith('`'):
            continue

        # Extract field name (always the first backtick-wrapped element)
        field_name_match = re.search(r'`(\w+)`', line)
        if not field_name_match:
            continue
        field_name = field_name_match.group(1)

        # Extract comment (case-insensitive search)
        comment_match = re.search(
            r'comment\s+[\'"]([^\'"]+)[\'"]', line, re.IGNORECASE)
        comment = comment_match.group(1) if comment_match else field_name

        fields.append((field_name, comment))

    return table_name, fields


def generate_typescript(table_name, fields):
    """Generate TypeScript interface from extracted fields"""
    ts_content = f"export const {table_name}Meta = {{\n"

    for field_name, comment in fields:
        camel_case = convert_to_camel_case(field_name)
        ts_content += f"  {camel_case}: {{ label: \"{comment}\" }},\n"

    ts_content += "};\n"
    return ts_content


def process_sql_file(sql_content):
    """Process a single SQL string and return the TypeScript content"""
    table_name, fields = extract_table_info(sql_content)
    if not table_name:
        return "Failed to extract table information"

    return generate_typescript(table_name, fields)


def process_sql_files():
    """Process all SQL files in the current directory"""
    sql_files = glob.glob("*.sql")

    for sql_file in sql_files:
        base_name = os.path.splitext(sql_file)[0]
        output_file = f"{base_name}.ts"

        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()

        ts_content = process_sql_file(sql_content)

        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(ts_content)

        print(f"Generated {output_file} from {sql_file}")


if __name__ == "__main__":

    # Process all SQL files
    process_sql_files()
