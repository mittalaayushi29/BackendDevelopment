const output = document.getElementById("output");


function arrayDemo() {

    const technologies = [
        "HTML",
        "CSS",
        "JavaScript",
        "Python"
    ];

    technologies.push("MongoDB");

    let result = "JavaScript Array\n\n";

    result += "Original Array: " +
              technologies.join(", ") + "\n";

    result += "Number of Elements: " +
              technologies.length + "\n\n";

    result += "Using forEach():\n";

    technologies.forEach(function (technology, index) {

        result +=
            (index + 1) +
            ". " +
            technology +
            "\n";

    });

    output.textContent = result;
}


function objectDemo() {

    const student = {

        name: "Aayushi Mittal",

        course: "Backend Development",

        semester: 5,

        technologies: [
            "HTML",
            "CSS",
            "JavaScript"
        ],

        introduce: function () {

            return (
                "Hello, I am " +
                this.name +
                " and I study " +
                this.course +
                "."
            );
        }
    };


    let result = "JavaScript Object\n\n";

    result += "Name: " +
              student.name + "\n";

    result += "Course: " +
              student.course + "\n";

    result += "Semester: " +
              student.semester + "\n";

    result += "Technologies: " +
              student.technologies.join(", ") +
              "\n\n";

    result += student.introduce();

    output.textContent = result;
}


function functionDemo() {

    // Normal function

    function add(a, b) {

        return a + b;

    }


    // Arrow function

    const multiply = (a, b) => {

        return a * b;

    };


    let result = "JavaScript Functions\n\n";

    result +=
        "Addition: 10 + 5 = " +
        add(10, 5) +
        "\n";

    result +=
        "Multiplication: 10 × 5 = " +
        multiply(10, 5);

    output.textContent = result;
}