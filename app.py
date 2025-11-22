from flask import Flask, request, jsonify

app = Flask(__name__)

#Initialize gradebook with subjects and grades
gradebook = []

#Show gradebook functionality
def show_gradebook():
    if not gradebook:
        return "The gradebook is currently empty."
    result = "Current Gradebook:<br>"
    for subject, grade in gradebook:
        result += f"{subject}: {grade}<br>"
    return result

#Add subject and grade to gradebook
def add_subject(subject, grade):
    gradebook.append([subject, grade])
    return f"Added {subject} with grade {grade} to the gradebook."

#Update grade for a subject
def update_grade(subject, new_grade):
    if not gradebook:
        return "The gradebook is currently empty. There are no grades to update."
    subject = subject.lower()
    for entry in gradebook:
        if entry[0].lower() == subject:
            entry[1] = new_grade
            return f"Updated {subject} to grade {new_grade}."
    return f"Subject {subject} not found in the gradebook."

#Remove subject from gradebook
def remove_subject(subject):
    subject = subject.lower()
    for entry in gradebook:
        if entry[0].lower() == subject:
            gradebook.remove(entry)
            return f"Removed {subject} from the gradebook."
    return f"Subject {subject} not found in the gradebook."

#Flask route for chatbot interaction
@app.route('/')
def home():
    return '''
    <h1>Gradebook Chatbot API</h1>
    <p>Welcome to the Gradebook ChatBot!</p>
    <p>Use the following endpoints to interact with the gradebook:</p>
    <ul>
        <li>/show - Show the current gradebook</li>
        <li>/add - Add a subject and grade</li>
        <li>/update - Update a grade for a subject</li>
        <li>/remove - Remove a subject from the gradebook</li>
    </ul>
    '''
@app.route('/show', methods=['GET'])
def show_gradebook_route():
    return show_gradebook()

@app.route('/add', methods=['POST'])
def add_subject_route():
    data = request.get_json()
    subject = data.get('subject')
    grade = data.get('grade')
    return add_subject(subject, grade)

@app.route('/update', methods=['PUT'])
def update_grade_route():
    data = request.get_json()
    subject = data.get('subject')
    new_grade = data.get('new_grade')
    return update_grade(subject, new_grade)

@app.route('/remove', methods=['DELETE'])
def remove_subject_route():
    data = request.get_json()
    subject = data.get('subject')
    return remove_subject(subject)

if __name__ == '__main__':
    app.run(debug=True)




 