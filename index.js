/*                              Leads Tracker Chrome Extension
It is an extension that lets us save the url address of potential customers on the internet either by writing the url by ourselves
 or by making the extension take the url of the current tab. */  

// calling the html element that has an id "input-leads" and assigning it to a variable called inputLeads
// we are using const instead of let or var, because we won't reassign the values later
const inputLeads = document.getElementById("input-leads")

// calling the html element that has an id "ul-leads" and assigning it to a variable called leadsUl
const leadsUl = document.getElementById("ul-leads")

// creating a variable that holds all the saved leads for display
let myLeads = [];

/* 
* we are accessing the localStorage api of the browser to retrieve leads, if there is any already saved with a key "myLeads"
* since localStorage only stores data in a string form and that we want the data as a list, we have to use JSON.parse to convert
* the JSON string to an object(which is a list in this case), so that we could use loop to access the data one by one
*/ 
const leadsFromLocalStorage = JSON.parse(localStorage.getItem("myLeads"))
console.log(leadsFromLocalStorage)

/* since there might not be any lead saved when the extension is opened, we are checking if the localStorage contains any lead, so that 
we assign the data from the localStorage to the "myLeads" array object we created at the start of the program, then we call the render()
method to display the leads
*/
if(leadsFromLocalStorage != null && leadsFromLocalStorage.length != 0) {
    myLeads = leadsFromLocalStorage;
    render(myLeads)
}

/*assigning the html element(Save Input Button) with the id "saveInputBtn" to the saveInputBtn variable */ 
const saveInputBtn = document.getElementById("saveInputBtn");
/**we are creating an event listener that listens if the saveInputBtn is clicked */
saveInputBtn.addEventListener("click", function() {
    // inserting the input value we got from the user to the "myLeads" array by using the "push" method
    myLeads.push(inputLeads.value)
    // making the input field empty by assigning it to an empty string to avoid duplicate insertions by mistake
    inputLeads.value = ""
    /* saving the "myLeads" array to localStorage with a key "myLeads" since we got a new input, by converting it to string using JSON.stringify(). 
    since localStorage only stores data in string form*/
    localStorage.setItem("myLeads", JSON.stringify(myLeads))
    // calling the render() method passing the array that contains the lead data, so that the leads are listed
    render(myLeads);
})

/*assigning the html element(Delete All Button) with the id "deleteBtn" to the deleteBtn variable */ 
const deleteBtn = document.getElementById("deleteBtn")
/**we are creating an event listener that listens if the deleteBtn is double clicked using "dblclick" event */
deleteBtn.addEventListener("dblclick", function() {
    // removing all data from the localStorage api using the "clear()" method
    localStorage.clear()
    // since the myLeads array might contain some data assigned to it, we also have to make it empty
    myLeads = []
    // calling the "render()" method to display the empty list, to show that the data is removed 
    render(myLeads)
})

/*assigning the html element(Save Tab Button) with the id "saveTabBtn" to the saveTabBtn variable */ 
const saveTabBtn = document.getElementById("saveTabBtn")
/**we are creating an event listener that listens if the saveTabBtn is clicked */
saveTabBtn.addEventListener("click", function() {
    /* since we want to retrieve the url of the current tab and save it as a lead, we use the chrome.tabs api to get the url*/ 
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        /* the function runs and gives the tab as an argument to use for finding the url, 
        since tabs is an array/list, we use the index 0 and retrieve the url property of that tab to get the url.
        Then we insert the url to the myLeads array*/
        myLeads.push(tabs[0].url)
        /* saving the "myLeads" array to localStorage with a key "myLeads" since we got a new input, by converting it to string using JSON.stringify(). 
        since localStorage only stores data in string form*/
        localStorage.setItem("myLeads", JSON.stringify(myLeads))
    // calling the render() method passing the array that contains the lead data, so that the leads are listed

        render(myLeads);

    })
}) 
/* the render() function basically traverses "myLeads" list and displays all leads using unordered list item in HTML. 
It accepts a list to be displayed as an argument for the function */
function render(leads) {
    
    /* creating a string that will contain the list item and the anchor tag to be included in the unordered list so that it will be used as an innerHTML */
    let listItems = "";
    // traversing through the leads array
    for(let i = 0; i < leads.length; i++) {
        /* using template string to construct string that also contains a variable in the middle of it,
         In the end the string will look something like this <li><a href="lead">lead</a></li>*/
        listItems += `
            <li>
                <a href="http://${leads[i]}" target="_blank">
                    ${leads[i]}
                </a>
            </li>
        `
    }
    // after constructing the string we assign it as an innerHTML of the unordered list tag assigned as leadsUl
    leadsUl.innerHTML = listItems
}