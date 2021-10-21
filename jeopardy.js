// categories is the main data structure for the app; it looks like this:
const BASE_API_URL = "https://jservice.io/api/";
const NUM_CATEGORIES = 6;
const NUM_CLUES_PER_CAT= 5;
//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

let categories = [];


/** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */
//dont foret to async all functions gathering api
//we use get here to grab our object that is our api
async function getCategoryIds() {
    let response = await axios.get(`${BASE_API_URL}`);
    //here is where we requet the categories
    let catIds =response.data.map(c => c.id);
    return _.sampleSize(catIds, NUM_CATEGORIES);
}

/** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */
//this will pull from the bank of categories with corresponding questions n answers
async function getCategory(catId) {
    let response = await axios.get(`${BASE_API_URL}category?id=${catId}`);
    //we request the category with specific id
    let cat = response.data;
    let allClues = cat.clues;
    let randomClues = _.sampleSize(allClues, NUM_CLUES_PER_CAT);
    //here we will take from allclues and randomly pick from the num of clues
    //which in our case is 6
    let clues = randomClues.map(c => ({
        question: c.question,
        answer: c.answer,
        showing: null
    }));
    return {title: cat.title, clues};
}

/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

/*we should label with <tr> and <td> and thats all in thead
then for tbody we'll have the questions in the tds,
to start out each element will have a ?*/

async function fillTable() {
    //row with headers for category names
    $("#jeopardy thead").empty();
    //the empty method will remove all child nodes, how we clear after each restart
    let $tr =$("<tr>");
    for( let catIdx = 0; catIdx< NUM_CATEGORIES; catIdx++) {
        $tr.append($("<th>").text(categories[catIdx].title));
    }
    /*here we will iterate through the number of categories then
    push the category names into the header slots*/
    $("#jeopardy thead").append($tr)
    //then we append the tr to the header we just created
;

//add rows for all the questions under the respective category
$("#jeopary tbody").empty();
 for (let clueIdx = 0; clueIdx< NUM_CLUES_PER_CAT; clueIdx++) {
     let $tr = $("<tr>")
     for (let catIdx = 0; catIdx < NUM_CATEGORIES; catIdx++) {
         $tr.append($("<td>").attr("id", `${catIdx}-${clueIdx}`).text("?"));
     }
     $("#jeopardy tbody").append($tr);
 }

}

/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {
    let id = evt.target.id;
    let [catId, clueId] = id.split("-");
    let clue = categories[catId].clues[clueId];

    let msg;

    /*if not showing we'll show the question, then if we are showing clue the we'll
    pull out the answer*/
    if(!clue.showing) {
        msg.clue.question;
        clue.showing = "question";
    } else if (clue.showing === "question")
 {
     msg = clue.answer;
     clue.showing = "answer";
 }
    else{return}
    //this is for after we've showing the question+answer
    $(`${catId}-${clueId}`).html(msg);
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {
    let catIds = await getCategoryIds();

    categories = [];
    for (let catId of catIds) {
        categories.push(await getCategory(catId));
    }

    fillTable();


}

$("#restart").on("click", setupAndStart);


/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

$(async function () {
    setupAndStart();
    $("#jeopardy").on("click", "td", handleclick);
}
);
//this will load us the clicking event for each of the panels
// TODO