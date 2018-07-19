'use strict'


/*

Hello Adhoc!



*/

var HHBuilder = {

    init: function() {
        this.household = {}

        this.assignEventListeners()
        this.createAddedElements()
    },

    genUID: function() {
        return Math.floor(Math.random() * 1000000)
    },
    
    
    assignEventListeners: function() {

        var submitButton = document.getElementsByTagName('button')[1]
        var addButton = document.getElementsByTagName('button')[0]
        var submitForm = document.getElementsByTagName('form')[0]
        var debugElement = document.getElementsByClassName('debug')[0]

        addButton.onclick = function(event) {

            event.preventDefault()

            var age = submitForm.age.value
            var smoker = this.returnSmokerValue(submitForm.smoker.checked)
            var relationship = submitForm.rel.value
            var newPerson = this.createPerson(age, smoker, relationship)
    
            try {
                this.addNewPerson(newPerson)
            } catch(message) {
                return Error(message)
            }

        }.bind(this)
    
        submitForm.onsubmit = function(event) {
            
            event.preventDefault()

            debugElement.innerHTML = JSON.stringify(this.household)
            debugElement.style.display = 'block'
            debugElement.style.whiteSpace = 'pre-line'
            
        }.bind(this)
    
        return
    },

    createAddedElements: function() {

        var householdContainer = document.createElement('div')
        householdContainer.id = 'household-container'
    
        var preElement = document.getElementsByTagName('pre')[0]
        document.body.insertBefore(householdContainer, preElement)
    
    },


    createPerson: function(age, smoker, relationship) {

        try {
            this.validateCreatePerson(age, relationship)
        } catch(message) {
            throw message
        }
        
        var newPerson = {
            age: age,
            smoker: smoker,
            relationship: relationship
        }
    
        return newPerson
    },

    validateCreatePerson: function(age, relationship) {

        if(age.length === 0) {
            alert('Age is required')
            throw Error('Invalid Age')
        }
    
        if(age <= 0) {
            alert('Age must be greater than 0')
            throw Error('Invalid Age')
        }
    
        if(relationship === '') {
            alert('Relationship is required')
            throw Error('Invalid Relationship')
        }
    
    },

    returnSmokerValue: function(checked) {

        if(checked) {
            return 'Yes'
        }
        if(!checked) {
            return 'No'
        }
    
    },


    createNewPersonElement: function(person, id) {

        var hhMemberElement = document.createElement('div')
        hhMemberElement.id = id.toString()
        hhMemberElement.innerHTML = (
            'Age: ' + person.age +
            ', Relationship: ' + person.relationship + 
            ', Smoker: ' + person.smoker
        )

        var deleteMemberButton = document.createElement('button')
        deleteMemberButton.innerHTML = 'delete'
        deleteMemberButton.onclick = function() {
            this.removePerson(id.toString())
        }.bind(this)

        hhMemberElement.appendChild(deleteMemberButton)

        return hhMemberElement
    
    },


    addNewPerson: function(person) {

        var id = this.genUID()
        this.household[id] = person

        var householdContainer = document.getElementById('household-container')
        var hhMemberElement = this.createNewPersonElement(person, id)
        householdContainer.appendChild(hhMemberElement)

    },

    removePerson: function(personIndex) {

        delete this.household[personIndex]
        document.getElementById('household-container')
            .removeChild(document.getElementById(personIndex.toString()))


    }

}

HHBuilder.init()
