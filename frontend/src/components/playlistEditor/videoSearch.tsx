import { ReactSearchAutocomplete } from 'react-search-autocomplete';
import { Video } from '../../model/video';

import styles from './videoSearch.module.css';
import { useState } from 'react';
import { useVideos } from '../../queries/useVideos';

type Args = {
    onSelect: (selection: Video) => void;
};

function formatResult(video: Video) {
    return (
        <>
            {video.title} ({video.prettyDuration})
        </>
    );
}

const options = {
    keys: ['title'],
};

// {
//   height: "44px",
//   border: "1px solid #dfe1e5",
//   borderRadius: "24px",
//   backgroundColor: "white",
//   boxShadow: "rgba(32, 33, 36, 0.28) 0px 1px 6px 0px",
//   hoverBackgroundColor: "#eee",
//   color: "#212121",
//   fontSize: "16px",
//   fontFamily: "Arial",
//   iconColor: "grey",
//   lineColor: "rgb(232, 234, 237)",
//   placeholderColor: "grey",
//   clearIconMargin: '3px 14px 0 0',
//   searchIconMargin: '0 0 0 16px'
// };

export function VideoSearch({ onSelect }: Args) {
    const [inputSearchString, setInputSearchString] = useState('');
    const items = useVideos();

    const selectItem = (item: Video) => {
        onSelect(item);
        setInputSearchString('');
    };

    return (
        <ReactSearchAutocomplete
            fuseOptions={options}
            items={items}
            onSelect={selectItem}
            onSearch={(str) => {
                setInputSearchString(str);
            }}
            resultStringKeyName='title'
            inputSearchString={inputSearchString}
            styling={{
                height: '32px',
                borderRadius: '0',
                fontSize: '1rem',
                color: 'inherit',
                hoverBackgroundColor: '#666',
            }}
            autoFocus
            className={styles.input}
            formatResult={formatResult}
        />
    );
}
