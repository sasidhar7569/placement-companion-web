const fs = require('fs');

const data = {};

// Helper to generate random numbers
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// 1. Time & Work
data['1'] = [];
for(let i=1; i<=25; i++) {
  let type = i % 3;
  if(type === 0) {
    let a = rnd(10, 20), b = rnd(15, 30);
    data['1'].push({
      id: i,
      question: `A can do a piece of work in ${a} days and B can do the same work in ${b} days. How long will they take to finish the work together?`,
      options: [`${Math.round((a*b)/(a+b))} days`, `${Math.round(((a*b)/(a+b))+1)} days`, `${Math.round(((a*b)/(a+b))-1)} days`, `${Math.round(((a*b)/(a+b))+2)} days`],
      answer: 0,
      explanation: `Work done = (${a}*${b})/(${a}+${b}) days.`
    });
  } else if(type === 1) {
    let m1 = rnd(10, 20), d1 = rnd(15, 25), m2 = rnd(15, 30);
    data['1'].push({
      id: i,
      question: `${m1} men can complete a work in ${d1} days. How many days will ${m2} men take to complete the same work?`,
      options: [`${Math.round((m1*d1)/m2)} days`, `${Math.round(((m1*d1)/m2)+2)} days`, `${Math.round(((m1*d1)/m2)+4)} days`, `${Math.round(((m1*d1)/m2)-2)} days`],
      answer: 0,
      explanation: `Using MDH rule: M1*D1 = M2*D2 => D2 = (${m1}*${d1})/${m2}.`
    });
  } else {
    let x = rnd(4, 10), y = rnd(12, 20);
    data['1'].push({
      id: i,
      question: `Pipe A can fill a tank in ${x} hours and Pipe B can empty it in ${y} hours. If both are opened, how long to fill?`,
      options: [`${Math.round((x*y)/(y-x))} hours`, `${Math.round(((x*y)/(y-x))+1)} hours`, `${Math.round(((x*y)/(y-x))-1)} hours`, `${Math.round(((x*y)/(y-x))+2)} hours`],
      answer: 0,
      explanation: `Time = (x*y)/(y-x) = (${x}*${y})/(${y}-${x}) hours.`
    });
  }
}

// 2. Percentages, Profit & Loss
data['2'] = [];
for(let i=1; i<=25; i++) {
  let cp = rnd(10, 50) * 100;
  let sp = cp + rnd(1, 5) * 100;
  data['2'].push({
    id: i,
    question: `A shopkeeper buys an article for Rs. ${cp} and sells it for Rs. ${sp}. Find his profit percentage.`,
    options: [`${((sp-cp)/cp)*100}%`, `${(((sp-cp)/cp)*100)+5}%`, `${(((sp-cp)/cp)*100)-5}%`, `${(((sp-cp)/cp)*100)+10}%`],
    answer: 0,
    explanation: `Profit = ${sp} - ${cp} = ${sp-cp}. % = (${sp-cp}/${cp})*100.`
  });
}

// 3. Number Systems
data['3'] = [];
for(let i=1; i<=25; i++) {
  let base = rnd(2, 9);
  let power = rnd(10, 50);
  data['3'].push({
    id: i,
    question: `Find the unit digit of ${base}^${power}.`,
    options: [`Depends on cyclicity`, `0`, `1`, `5`],
    answer: 0,
    explanation: `The unit digit repeats in cycles (e.g., cycle of 4 for base 2,3,7,8).`
  });
}

// 4. Syllogisms
data['4'] = [];
const syllogismItems = ['cats', 'dogs', 'birds', 'trees', 'cars', 'phones'];
for(let i=1; i<=25; i++) {
  let a = syllogismItems[rnd(0,2)], b = syllogismItems[rnd(3,5)];
  data['4'].push({
    id: i,
    question: `Statements: All ${a} are ${b}. Some ${b} are intelligent. Conclusion: Some ${a} are intelligent.`,
    options: ["True", "False", "Cannot be determined", "None"],
    answer: 2,
    explanation: `No direct intersection is given between ${a} and intelligent.`
  });
}

// 5. Blood Relations
data['5'] = [];
for(let i=1; i<=25; i++) {
  data['5'].push({
    id: i,
    question: `Pointing to a photograph, a man said, "I have no brother or sister but that man's father is my father's son." Whose photograph was it?`,
    options: ["His son's", "His own", "His father's", "His nephew's"],
    answer: 0,
    explanation: `Since he has no sibling, 'my father's son' is himself. So the man's father is himself. Thus, it's his son's photograph.`
  });
}

// 6. Seating Arrangements
data['6'] = [];
for(let i=1; i<=25; i++) {
  data['6'].push({
    id: i,
    question: `A, B, C, D, E are sitting in a row facing North. A is next to B, C is next to D. If E is at the left end, where is C?`,
    options: ["Cannot be determined", "Right end", "Middle", "Second from left"],
    answer: 0,
    explanation: `Not enough positional data is provided to fix C's exact spot.`
  });
}

// 7. Operating Systems
data['7'] = [];
for(let i=1; i<=25; i++) {
  data['7'].push({
    id: i,
    question: `Which of the following is a condition for deadlock?`,
    options: ["Mutual Exclusion", "Hold and Wait", "No Preemption", "All of the above"],
    answer: 3,
    explanation: `Deadlock requires 4 conditions: Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait.`
  });
}

// 8. DBMS
data['8'] = [];
for(let i=1; i<=25; i++) {
  data['8'].push({
    id: i,
    question: `Which normal form deals with removing transitive dependencies?`,
    options: ["1NF", "2NF", "3NF", "BCNF"],
    answer: 2,
    explanation: `3NF ensures that non-prime attributes are not transitively dependent on the primary key.`
  });
}

// 9. Computer Networks
data['9'] = [];
for(let i=1; i<=25; i++) {
  data['9'].push({
    id: i,
    question: `Which layer of the OSI model does a router operate at?`,
    options: ["Physical", "Data Link", "Network", "Transport"],
    answer: 2,
    explanation: `Routers use IP addresses to route packets, which happens at the Network layer.`
  });
}

// 10. OOP
data['10'] = [];
for(let i=1; i<=25; i++) {
  data['10'].push({
    id: i,
    question: `Which OOP concept is demonstrated when a subclass provides a specific implementation of a method that is already provided by its parent class?`,
    options: ["Method Overloading", "Method Overriding", "Encapsulation", "Abstraction"],
    answer: 1,
    explanation: `Overriding allows a subclass to provide a specific implementation of a method inherited from the superclass.`
  });
}

// 11. Reading Comprehension
data['11'] = [];
for(let i=1; i<=25; i++) {
  data['11'].push({
    id: i,
    question: `In a passage, if the author repeatedly uses words like 'lamentable', 'tragic', and 'sorrowful', what is the primary tone?`,
    options: ["Optimistic", "Melancholic/Sad", "Objective", "Satirical"],
    answer: 1,
    explanation: `These adjectives express sadness and grief.`
  });
}

// 12. Sentence Correction
data['12'] = [];
for(let i=1; i<=25; i++) {
  data['12'].push({
    id: i,
    question: `Identify the correct sentence:`,
    options: [
      `The group of students are going to the museum.`,
      `The group of students is going to the museum.`,
      `The groups of student is going to the museum.`,
      `The group of student are going to the museum.`
    ],
    answer: 1,
    explanation: `'Group' is a singular collective noun, so it takes the singular verb 'is'.`
  });
}

const fileContent = `export const practiceData = ${JSON.stringify(data, null, 2)};\n`;

if (!fs.existsSync('./src/data')) {
  fs.mkdirSync('./src/data');
}

fs.writeFileSync('./src/data/practiceData.js', fileContent);
console.log('Practice data generated successfully.');
