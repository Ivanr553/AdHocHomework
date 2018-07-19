import fetch from "../util/fetch-fill";
import URI from "urijs";

// /records endpoint
window.path = "http://localhost:3000/records";

const retrieve = (rawOptions) => {

    const options = checkOptions(rawOptions)

    return makeFetch(options).then(data => {
        const result = constructPayload.returnBody(data, options.colors, options.page)
        return result
    }).catch(error => {
        return console.log(error)
    })

}

const checkOptions = (options) => {

    if(!options) {
        options = {
            page: 1,
            colors: ['red', 'brown', 'blue', 'yellow', 'green']
        }
    }

    if(!options.page) {
        options.page = 1
    }

    if(!options.colors) {
        options.colors = ['red', 'brown', 'blue', 'yellow', 'green']
    }

    return options

}

const makeFetch = (options) => {

    const limit = 11
    const offset = constructUrl.getOffsetFromPage(options.page)
    let colorUrl = 
        options.colors.length >= 1 ? 
            constructUrl.createColorUrl(options.colors) : 
            constructUrl.createColorUrl(null)

    const url = `${window.path}?limit=${limit}&offset=${offset}${colorUrl}`

    return fetch(url)
        .then(response => {
            if(response.ok) {
                return response.json().then(data => {
                    return data
                })
            }
        })
        .catch(error => {
            throw console.log(error)
        })

}

const constructUrl = {

    getOffsetFromPage: function(page) {

        if(!page) {
            page = 1
        }
    
        return ((page-1) * 10)
    },
    
    createColorUrl: function(colors) {
        
        let colorUrl = ``
    
        colors.forEach(
            color => {
                colorUrl += `&color[]=${color}`
            }
        )
    
        return colorUrl
    
    }


}


const constructPayload = {

    returnBody: function(response, colors, page) {

        const nextPage = this.getNextPage(response, page)
    
        response = response.filter((item, index) => {
            return index !== 10
        })
    
        const ids = response.map(item => item.id)
        const open = this.returnOpenArray(response)
        const closedPrimaryCount = this.getClosedPrimaryCount(response)
        const previousPage = this.getPreviousPage(page)
    
        const body = {
            ids: ids,
            open: open,
            closedPrimaryCount: closedPrimaryCount,
            previousPage: previousPage,
            nextPage: nextPage
        }
    
        return body
    
    },
    
    getNextPage: function(response, page) {
        if(response.length > 10) {
            return page + 1
        } else {
            return null
        }
    },

    getPreviousPage: function(page) {
        return page <= 1 ? null : page - 1
    },
    
    returnOpenArray: function(response) {
    
        let open = response.filter(item => item.disposition === 'open')
    
        open.map(item => item.isPrimary = false)
    
        open.filter(item => (item.color === 'red' || item.color === 'blue' || item.color === 'yellow'))
            .map(item => item.isPrimary = true)
    
        return open
    
    },

    getClosedPrimaryCount: function(response) {

        const filteredResponse = response.filter(item => {
            return (
                item.disposition === 'closed'
                && (item.color === 'red' || item.color === 'blue' || item.color === 'yellow')
            )
        })

        return filteredResponse.length
        
    }
}

export default retrieve;
