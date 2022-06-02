window.addEventListener('load', loadCharacters);
const root = document.getElementById('root');
const charactersWrap = document.querySelector('#characters-wrap');
const searchInput = document.querySelector('#search-input');
const searchButton = document.querySelector('#search-btn');
searchButton.addEventListener('click', searchPressed);
const loadMore = document.querySelector('.load-more');
loadMore.addEventListener('click', loadMorePressed);
loadMore.classList.add('disabled');

let idArr = [];
function searchPressed() {
  const searchId = parseInt(searchInput.value);
  if (searchInput.value === '') {
    return;
  }
  if (idArr.includes(searchId)) {
    alert('Character is already in the list');
    searchInput.value = '';
    return;
  }
    idArr.push(searchId);
    overflow();
    searchInput.value = '';

  async function loadRickAndMorty() {
    const server = `https://rickandmortyapi.com/api/character/${searchId}`;
    const response = await fetch(server, {
      method: 'GET'
    });
    const responseResult = await response.json();

    if (response.ok) {
      getCharacter(responseResult);
    } else {
      alert('Character not found');
    }
  }
  loadRickAndMorty();  
  function getCharacter(data) {
    let myData = JSON.stringify(data);
    localStorage.setItem(`${searchId}`, myData);
    const charImg = data.image;
    const charName = data.name;
    const charSpecies = data.species;
    const charStatus = data.status;
    const template = `
    <img src='${charImg}' alt='${charName}'>
    <p class='text-info'>Name: ${charName}</p>
    <p class='text-info'>Species: ${charSpecies}</p>
    <p class='text-info'>Status: ${charStatus}</p>
    <button class='delete-btn'>Remove</button>
    `;

    let conteiner = document.createElement('div');
    conteiner.className = 'character-conteiner';
    conteiner.id = data.id;
    conteiner.innerHTML = template;
    charactersWrap.prepend(conteiner);

    const deleteBtn = document.querySelectorAll('.delete-btn');
    deleteBtn.forEach((btn) => {
      btn.addEventListener('click', deletePressed);
    });
  }
}
 function overflow() {
   if (charactersWrap.children.length >= 5) {
     const characterCollection = document.querySelectorAll(
       '.character-conteiner'
     );
     characterCollection.forEach((el, id) => {
       if (id >= 4) {
         el.classList.add('hidden');
       }
     });
     loadMore.classList.remove('disabled');
   }
 }
 
function deletePressed() {
  if (!confirm('Do you really want to remove the character?')) {
    return;
  }
  const parentElem = this.parentNode;
  let idValue = parseInt(this.parentNode.id);
  if (idArr.includes(idValue)) {
    for (let i = 1; i < idArr.length; i++) {
      if (idArr[i].value === idValue.value) {
        idArr.splice(i, 1);
        i--;
      }
    }
  }
  parentElem.remove();
}
function loadMorePressed() {
  const hiddenCharacters = document.querySelectorAll('.hidden');
  hiddenCharacters.forEach((el, id) => {
    if (id <= 4) {
      el.classList.remove('hidden');
    }
  });
  window.scrollTo(0, document.body.scrollHeight);
}
function loadCharacters() {
  if (!localStorage) {
    return;
  }
  let keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i));
  }
  console.log(keys);
  keys.forEach((el) => {
    let character = JSON.parse(localStorage.getItem(`${parseInt(el)}`));
    const charImg = character.image;
    const charName = character.name;
    const charSpecies = character.species;
    const charStatus = character.status;
    const template = `
    <img src='${charImg}' alt='${charName}'>
    <p class='text-info'>Name: ${charName}</p>
    <p class='text-info'>Species: ${charSpecies}</p>
    <p class='text-info'>Status: ${charStatus}</p>
    <button class='delete-btn'>Remove</button>
    `;
    let conteiner = document.createElement('div');
    conteiner.className = 'character-conteiner';
    conteiner.id = character.id;
    conteiner.innerHTML = template;
    charactersWrap.prepend(conteiner);
      idArr.push(parseInt(el));
      console.log(idArr)
  });
  overflow();
}