import IWord from "../Interfaces/IWord";

const getWords = (group: number, page: number, callback: React.Dispatch<React.SetStateAction<IWord[]>>) => {
  fetch(`https://rslang-b.herokuapp.com/words?group=${group}&page=${page}`)
  .then((res) => res.json())
  .then((res) => callback(res))
  .catch((err) => console.log(err))
}
export default getWords;