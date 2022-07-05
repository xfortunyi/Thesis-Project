import React, { useEffect, useState } from 'react';
import { GifSearcherProps } from '../../Types/Canvas.interface';
import '../GifSearcher/GifSearcher.css';
import { Gif } from '../../Types/GifSearcher.interface';

const StickerSearcher = ({ setNewGif, setRender }: GifSearcherProps) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [gifs, setGifs] = useState<Gif[]>([]);
  const [flag, setFlag] = useState<number>(0);
  const [search, setSearch] = useState<string>('');

  const giphySearchEndpoint: string =
    'https://api.giphy.com/v1/stickers/search?';
  const giphyApiKey: string = 'api_key=' + process.env.REACT_APP_GIPHY_KEY;
  const searchQuery: string = `&q=${search}`;
  const queryLimit = '&limit=20';
  const url = giphySearchEndpoint + giphyApiKey + searchQuery + queryLimit + '';

  const searchGif = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue === '') {
      setError(true);
    }
    setSearch(searchValue);
    setError(false);
    setSearchValue('');
  };

  const fetchGiphy = async () => {
    if (flag < 10) {
      let fetched = flag;
      try {
        let res = await fetch(url);
        setFlag(fetched + 1);
        let jsonRes = await res.json();
        setGifs(jsonRes.data);
      } catch (error) {}
    } else {
      console.log('you fetched more than 10 times already');
    }
  };

  useEffect(() => {
    fetchGiphy();
  }, [search]);

  const handleClick = (gifClicked: Gif) => {
    console.log(gifClicked, 'gifCLicked');
    setNewGif(gifClicked.images.downsized_medium.url);
    setRender(true);
  };

  return (
    <div className='searchGif-container'>
      <div className='search-gif'>
        <form onSubmit={searchGif}>
          <label>Gif Searcher</label>
          <input
            type='text'
            placeholder='Type here'
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          ></input>
          <button>SEARCH GIF</button>
        </form>
      </div>

      {error ? <p className='error'> The search field cannot be empty </p> : ''}

      <div className='gifResult-container'>
        {gifs &&
          !error &&
          gifs.map((gif, index) => {
            return (
              <img
                src={gif.images.downsized_medium.url}
                key={index.toString()}
                alt={'not loaded'}
                width={230}
                onClick={() => {
                  return handleClick(gif as unknown as Gif);
                }}
              />
            );
          })}
      </div>
    </div>
  );
};

export default StickerSearcher;
