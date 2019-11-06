const URL = "http://localhost:4000/"

document.addEventListener("DOMContentLoaded", function(){

    // DEFINTIONS =====================================================================================
    let tools = document.getElementsByClassName("tools")[0]
    let addButton = tools.getElementsByTagName("BUTTON")[0]
    let selection = tools.getElementsByTagName("SELECT")[0]
    let movieContainer = document.getElementsByClassName("movie-container")[0]
    let horrorList = document.getElementById("horror")
    let comedyList = document.getElementById("comedy")
    let actionList = document.getElementById("action")

    // this is a hash to store all the movies we fetch originally
    let movies = {
        "horror": [],
        "comedy": [],
        "action": []
    }

    // ===================================  FUNCTIONS ============================================================

    
    // *************************** ADDING MOVIES *************************************

    // When add movie is clicked, make form visible and add event listener
    function addMovieClickHandler(e){
        let form = document.getElementById("add-movie-form")
        form.style.display= "block"
        form.addEventListener("submit", addMovieFormSubmitHandler)
        
        //hide button
        e.target.style.display = "none"

    }

    // When add movie form is submiotted, 
    function addMovieFormSubmitHandler(e){
        e.preventDefault();

        let genre = e.target[0].value

        let movie = {
            title: e.target[1].value,
            "duration-in-hours": e.target[2].value,
            cover: e.target[3].value,
            cast: [
                {
                    name: e.target[4].value,
                    character: e.target[5].value
                }
            ]
        }

        // Add the movie to the API then append to the DOM
        fetch(`${URL}${genre}`,{
            method: "POST",
            headers: {
                "content-type": "application/json",
                 accept: "application/json"
            },
            body: JSON.stringify(movie)
        }).then(resp => resp.json())
        .then(data => appendMovie(data, genre))
        
        // Make the form invisible again
        let form = document.getElementById("add-movie-form")
        form.style.display= "none"

        // Made the add movie button visible again
        addButton.style.display = "block"

    }


    //*************************** FILTERING INDEX    *************************************
    
    //When selection filter changes
    function selectionChangeHandler(e){
    
        //first display everything
        horrorList.style.display = "block"
        comedyList.style.display = "block"
        actionList.style.display = "block"

        //then hide accordingly
        if(e.target.value == "horror"){

            comedyList.style.display = "none"
            actionList.style.display = "none"

        }else if(e.target.value == "comedy"){

            horrorList.style.display = "none"
            actionList.style.display = "none"

        }
        else if(e.target.value == "action"){

            horrorList.style.display = "none"
            comedyList.style.display = "none"

        }
    }



    //*************************** CAST MANIPULATION *************************************

    //When view cast is clicked
    function viewCastClickHandler(e){
        
        //find the cast table
        let castList = e.target.parentNode.parentNode.getElementsByTagName("table")[0]

        // if viewing cast
        if(e.target.innerText === "View Cast"){
           
            // make cast table visible
            castList.style.display = "block"

            //change button text to "Hide Cast"
            e.target.innerText = "Hide Cast"

        //if hide cast
        }else if(e.target.innerText === "Hide Cast"){

            // change the button to "View Cast"
            e.target.innerText = "View Cast"

            // make the cast note visible
            castList.style.display = "none"

        }
    }

    //Add a given cast member to a given cast table
    function appendCastMember(member, table ){
    
    let row = document.createElement("tr")
    let name = document.createElement("td")
    let char = document.createElement("td")
    name.innerText = `${member.name} as...`
    char.innerText = member.character
    row.appendChild(name)
    row.appendChild(char)
    table.appendChild(row)

    }

    // When submitting the add cast member form
    function submitAddCastMemberHandler(e){
        e.preventDefault()

        //find the temp card and id and genre
        let card = e.target.parentNode
        let id = card.dataset.movie_id
        let genre = card.dataset.genre

        //remove the form
        card.removeChild(e.target)
      
        //locate the movie in order to grab the existing cast
        let movie = movies[genre].find(element => element.id === parseInt(id) )
        let oldCast = movie.cast

        //create the new cast memeber
        let castMember = {
            name: e.target[0].value,
            character: e.target[1].value
        }

        // add that cast member to the cast array
        let newCast = [...oldCast, castMember]
        
        let obj = {
            cast: newCast
        }
     
        //make the patch with the cast element
        fetch(`${URL}${genre}/${id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
                 accept: "application/json"
            },
            body: JSON.stringify(obj)

        }).then(resp => resp.json())
        .then(data => {

            //add the cast-member to this card's cast table
            appendCastMember(castMember, card.getElementsByTagName("table")[0])
            
            //add to the hidden card on the main page
            let list = document.getElementById(genre)
            let mov = list.querySelector(`[data-movie_id="${id}"]`)
            let tab = mov.getElementsByTagName("table")[0]
            appendCastMember(castMember, tab)

        })


    }

    // When add cast member button is clicked, show the form
    // This only happens on the show card
    function addCastMemberClickHandler(e){
        let card = e.target.parentNode

        //create the form
        let form = document.createElement("form")
        form.id = "add-cast-member-form"
        let nameIn = document.createElement("input")
        nameIn.type = "text"
        nameIn.placeholder = "Name"

        let charIn = document.createElement("input")
        charIn.type = "text"
        charIn.placeholder = "Character"

        let sub = document.createElement("input")
        sub.type = "submit"
        
        form.appendChild(nameIn)
        form.appendChild(charIn)
        form.appendChild(sub)

        card.appendChild(form)

        //Add event listener for submit
        form.addEventListener("submit", submitAddCastMemberHandler)
    
    }
    //*************************** END CAST MANIPULATION *************************************





    //*************************** SHOWING INDIVIDUAL MOVIE *************************************

    //When Go Back button is clicked
    function goBackClickHandler(e){

        //find and remove the temp card
        let card = e.target.parentNode
        movieContainer.removeChild(card)

        // Make Everything else Visible again
        horrorList.style.display = "block"
        comedyList.style.display = "block"
        actionList.style.display = "block"

    }

    //When movie cover image clicked
    function clickMovieCoverHandler(e){
        let card = e.target.parentNode

        //create a temporary movie card and copy the info
        let tempCard = document.createElement("div")
        tempCard.className = "movie-card"
        tempCard.dataset.movie_id = card.dataset.movie_id
        tempCard.dataset.genre = card.dataset.genre
        tempCard.innerHTML = card.innerHTML

        let deleteButton = tempCard.getElementsByClassName("delete-button")[0]
        let castButton = tempCard.getElementsByClassName("cast-button")[0]
        castButton.addEventListener("click", viewCastClickHandler)
        deleteButton.addEventListener("click", deleteMovieClickHandler)

        // Hide Everything else
        horrorList.style.display = "none"
        comedyList.style.display = "none"
        actionList.style.display = "none"


        //Add the go back button with event listener
        let goBack = document.createElement("button")
        goBack.innerText = "Go Back"
        tempCard.appendChild(goBack)
        goBack.addEventListener("click", goBackClickHandler)

        //Add the add cast member Button with event listener
        let addMember = document.createElement("button")
        addMember.innerText = "Add Cast Member"
        tempCard.appendChild(addMember)
        addMember.addEventListener("click", addCastMemberClickHandler)

        //add the temp card to the DOM
        movieContainer.appendChild(tempCard)
       
    }



    //*************************** DELETING MOVIES *************************************

    //When delete movie is clicked
    function deleteMovieClickHandler(e){
        
        //Find the movie card that is to be deleted
        // And get the genre and the id
        let parent = e.target.parentNode.parentNode
        let id = parent.dataset.movie_id
        let genre = parent.dataset.genre
        let list = document.getElementById(genre)

        // Check if we are on the index page or a show  page
        // if on show page, we will need to go back
        let goBack = true
        if(parent.tagName === "LI"){
            // this means that we are on the main index page
            goBack = false
        }

        // Make DELETE fetch
        fetch(`${URL}${genre}/${id}`, {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                 accept: "application/json"
            }
        }).then(resp => {

            //if on the single "show" page, delete and go back
            if(goBack){
                
                //remove the temp card
                movieContainer.removeChild(parent)

                //show everything else
                horrorList.style.display = "block"
                comedyList.style.display = "block"
                actionList.style.display = "block"

                //and now remove normal movie card from main list
                let mov = list.querySelector(`[data-movie_id="${id}"]`)
                console.log("removing ", mov, "from ", list)
                list.removeChild(mov)


            // if we are already on the main index page
            //remove parent (the regular li card) from index list
            }else{
                list.removeChild(parent)
            }
        })
    }
    



    //*************************** APPEND MOVIE TO DOM *************************************

    // Add a single movie object to the approriate list
    function appendMovie(movie, genre){
        let list = document.getElementById(genre)
        list.appendChild(document.createElement("hr"))

        let li = document.createElement("li")
        li.className = "movie-card"
        li.dataset.movie_id = movie.id
        li.dataset.genre = genre

        let title = document.createElement("h2")
        title.innerText = movie.title

        let duration = document.createElement("h3")
        duration.dataset.time = movie["duration-in-hours"]
        duration.innerText = `Duration: ${duration.dataset.time} hours`
        
        
        let cover = document.createElement("img")
        cover.src = movie.cover
        cover.addEventListener("click", clickMovieCoverHandler)

        let castHolder = document.createElement("h4")
        let castButton = document.createElement("button")
        castButton.innerText = "View Cast"
        castButton.className = "cast-button"
        castButton.addEventListener("click", viewCastClickHandler)
        castHolder.appendChild(castButton)

        // --------------CREAT CAST TABLE -----------------------
        let castTable = document.createElement("table")
        castTable.style.display = "none"
        
        // Add headers
        let headerRow = document.createElement("tr")
        let header = document.createElement("th")
        header.innerText = "CAST:"
        headerRow.appendChild(header)
        castTable.appendChild(headerRow)

        //Add each character
        movie.cast.forEach(function(member){
            let row = document.createElement("tr")
            let name = document.createElement("td")
            let char = document.createElement("td")
            name.innerText = `${member.name} as...`
            char.innerText = member.character
            row.appendChild(name)
            row.appendChild(char)
            castTable.appendChild(row)
        })
        
        //END CAST TABLE -------------------------------------

        let deleteHolder = document.createElement("h4")
        let deleteButton = document.createElement("button")
        deleteButton.innerText = "Delete Movie"
        deleteButton.className = "delete-button"
        deleteButton.addEventListener("click", deleteMovieClickHandler)
        deleteHolder.appendChild(deleteButton)

        li.appendChild(title)
        li.appendChild(duration)
        li.appendChild(cover)
        li.appendChild(castHolder)
        li.appendChild(castTable)
        li.appendChild(deleteHolder)
        list.appendChild(li)
        
    }

    //*************************** END APPEND MOVIE TO DOM *************************************


    // fetch the movies from the API
    function fetchMovies(){

        // Get Comedy
        fetch(`${URL}comedy`).then(resp => resp.json())
            .then(function(data){
                data.forEach((el) => {
                    appendMovie(el, "comedy")
                })
                movies.comedy = data
            })

        // Get horror
        fetch(`${URL}horror`).then(resp => resp.json())
            .then(function(data){
                data.forEach((el) => {
                    appendMovie(el, "horror")
                })
                movies.horror = data
            })
        
        // Get action
        fetch(`${URL}action`).then(resp => resp.json())
            .then(function(data){
                data.forEach((el) => {
                    appendMovie(el, "action")
                })
                movies.action = data
            })

    }
    // =============================================    END FUNCTIONS     ==============================================
    
    
    // =============================================     EXECUTION        ===============================================
    
    //--------- ADD the ADD MOVIE FORM ------------------
    let holder = document.createElement("div")
    let addForm = document.createElement("form")
    addForm.id = "add-movie-form"

    let genreSelect = document.createElement("select")
    genreSelect.form = "add-movie-form"
    let optionCom = document.createElement("option")
    optionCom.value = "comedy"
    optionCom.innerText = "Comedy"
    genreSelect.appendChild(optionCom)
    let optionHor = document.createElement("option")
    optionHor.value = "horro"
    optionHor.innerText = "Horror"
    genreSelect.appendChild(optionHor)
    let optionAct = document.createElement("option")
    optionAct.value = "action"
    optionAct.innerText = "Action"
    genreSelect.appendChild(optionAct)
    
    let titleInput = document.createElement("input")
    titleInput.type="text"
    titleInput.placeholder= "Title"

    let durInput = document.createElement("input")
    durInput.type="text"
    durInput.placeholder= "Duration (hours)"

    let coverInput = document.createElement("input")
    coverInput.type="text"
    coverInput.placeholder= "Link to cover"

    let castMemberName = document.createElement("input")
    castMemberName.type = "text"
    castMemberName.placeholder = "Lead name"

    let castMemberChar = document.createElement("input")
    castMemberChar.type = "text"
    castMemberChar.placeholder = "Lead Character"

    let submitButton = document.createElement("input")
    submitButton.type="submit"

    addForm.appendChild(genreSelect)
    addForm.appendChild(titleInput)
    addForm.appendChild(document.createElement("br"))
    addForm.appendChild(durInput)
    addForm.appendChild(document.createElement("br"))
    addForm.appendChild(coverInput)
    addForm.appendChild(document.createElement("br"))
    addForm.appendChild(castMemberName)
    addForm.appendChild(castMemberChar)
    addForm.appendChild(submitButton)
    holder.appendChild(addForm)

    addForm.style.display= "none"

    addButton.insertAdjacentHTML("afterEnd", holder.innerHTML)
    //--------------- FINISHED ADD MOVIE FORM ------------------

    //Add listener to add movie button (defined in line 27)
    addButton.addEventListener("click", addMovieClickHandler)

    //Add listener to genre selector (defined in line 47)
    selection.addEventListener("change", selectionChangeHandler)

    //Get all them movies
    fetchMovies()

    // END EXECUTION ==================================================================================
    


}) // End DOM Content Loaded Listener