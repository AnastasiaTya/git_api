const resultList = document.querySelector('.search__result')
const cardList = document.querySelector('.card__list')
const template = document.getElementById('tmpl')

const searchLine = document.querySelector('.search')

const API = "https://api.github.com/search/repositories"

const url = new URL(API);
url.searchParams.append('sort', 'stars');
url.searchParams.append('per_page', '5');

const error = document.querySelector('.error__text')

const debounce = (fn, debounceTime) => {
    let timeout
    return function() {
        const func = () => {
            fn.apply(this, arguments)
        }
        clearTimeout(timeout)
        timeout = setTimeout(func, debounceTime)
    }
};

const fetchApi = async (api) => {
    try {
        let response = await fetch(api)
        if(!response.ok) {
            throw new Error('Ошибка сервера, попробуйте повторить позже')
        }
        let result = await response.json()
        if(!result.items.length){
            throw new Error('Ничего не найдено')
        } else {
            result.items.forEach(item => {
                getSearchList(item);
            });
        }
    } catch(err) {
        if(err instanceof Error) {
            error.textContent = err.message
        }
    }
}

const getDebounceResponse = debounce(fetchApi, 500);

const getInputValue = (e) => {
    clearSearchList()
    clearError()
    let value = e.target.value.trim()
    if(value.length) {
        url.searchParams.set('q', value)
        getDebounceResponse(url.href)
    }
}

const getSearchList = (data) => {
    let listItem = document.createElement('li')
    listItem.classList.add('result')
    listItem.textContent = data.name
    resultList.appendChild(listItem)
    listItem.addEventListener('click', () => addCard(data.name, data.owner.login, data.stargazers_count), {once: true})
}

const addCard = (name, owner, stars) => {
    searchLine.value = ''
    clearSearchList()

    cardList.appendChild(template.content.cloneNode(true))

    const card = document.querySelectorAll('.card__item')
    const currentCard = card[card.length - 1]
    const cardName = currentCard.querySelector('.name__info')
    cardName.textContent = name
    const cardOwner = currentCard.querySelector('.owner__info')
    cardOwner.textContent = owner
    const cardStars = currentCard.querySelector('.stars__info')
    cardStars.textContent = stars
    currentCard.addEventListener('click', removeCard)
}

const removeCard = (e) => {
    if(e.target.getAttribute('class') === 'button' || e.target.getAttribute('class') === 'button__img') {
        e.currentTarget.remove()
        e.currentTarget.removeEventListener('click', removeCard)
    }
}

const clearSearchList = () => {
    let li = document.querySelectorAll('.result')
    li.forEach(item => item.remove())
}

const clearError = () => {
    error.textContent = ''
}

searchLine.addEventListener('input', getInputValue)