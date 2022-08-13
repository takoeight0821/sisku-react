import './App.css';
import { ChangeEvent, useEffect, useState } from 'react';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { CssBaseline } from '@mui/material';
import { ElevationScroll } from './ElevationScroll';
import { SearchAppBar } from './SearchAppBar';
import ReactMarkdown from 'react-markdown';
import Box from '@mui/system/Box';
import * as lsp from "vscode-languageserver-types";

interface Projects {
  [projectId: string]: Hovercraft;
}

interface Hovercraft {
  projectId: string;
  pages: Array<Page>;
}

interface Page {
  entries: Array<Entry>;
}

interface Entry {
  document: lsp.TextDocumentIdentifier;
  projectId: string;
  hover: lsp.Hover;
  definition: { uri: lsp.URI, range: lsp.Range };
}

function App() {
  const [inputText, setInputText] = useState('');
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/hovercraft')
      .then(res => res.json())
      .then(res => { console.log(res); return res; })
      .then((projects: Projects) => {
        for (let projectId in projects) {
          const hovercrafts = projects[projectId];
          for (let page of hovercrafts.pages) {
            for (let entry of page.entries) {
              setEntries(entries => [...entries, entry]);
            }
          }
        }
      });
  }, []);

  const inputHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  return (
    <>
      <CssBaseline />
      <ElevationScroll>
        <SearchAppBar onChange={inputHandler} />
      </ElevationScroll>
      <Toolbar />
      <ItemsList inputText={inputText} entries={entries} />
    </>
  );
}

const ItemsList = ({ inputText, entries }: { inputText: string, entries: Entry[] }) => {
  const hovers = entries.map((e) => {
    if (typeof e.hover.contents == "string") {
      return e.hover.contents;
    } else if (Array.isArray(e.hover.contents)) {
      return e.hover.contents.join("\n");
    } else {
      return e.hover.contents.value;
    }
  }).filter(h => h.length > 0)
    .filter(h => h.toLowerCase().includes(inputText));

  return (
    <List>
      {hovers.map((hover, id) => (<ListItem key={id} >
        <Box sx={{
          border: 1, mx: 1, px: 2, width: '100%',
        }}>
          <ReactMarkdown>{hover}</ReactMarkdown>
        </Box>
      </ListItem>
      ))}
    </List>
  );

};

export default App;
