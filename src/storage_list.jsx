import React, { useState, useEffect } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

const StorageList = (variable) => {
    const [files, setFiles] = useState([]);
    const [urlList, setUrlList] = useState({}); // Declare urlList as a state variable
    const storage = getStorage();

    useEffect(() => {
        const fetchStorageContent = async () => {
            try {
                const storageRef = ref(storage, 'your-folder/');
                const listResult = await listAll(storageRef);
                const fileArray = listResult.items.map(item => item.name);

                // Use a temporary variable to store the URL list
                const tempUrlList = {};
                for (const file of fileArray) {
                    const itemRef = ref(storage, `your-folder/${file}`);
                    const downloadURL = await getDownloadURL(itemRef);
                    tempUrlList[file] = downloadURL;
                }

                setFiles(fileArray);
                setUrlList(tempUrlList); // Update the state with the URL list

            } catch (error) {
                console.error('Error fetching storage content:', error);
            }
        };

        fetchStorageContent();
    }, [variable]);


    return (
        <div>
            <h2>Storage Content:</h2>
            <ul>
                {files.map((file, index) => (
                    <li key={index}>
                        <a href={urlList[file]} target="_blank" rel="noopener noreferrer">{file}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StorageList;
