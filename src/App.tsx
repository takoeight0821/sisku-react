import './App.css';
import { ChangeEvent, useState } from 'react';
import { faker } from '@faker-js/faker';
import Toolbar from '@mui/material/Toolbar';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { CssBaseline } from '@mui/material';
import { ElevationScroll } from './ElevationScroll';
import { SearchAppBar } from './SearchAppBar';
import ReactMarkdown from 'react-markdown';
import Box from '@mui/system/Box';

function App() {
  const [inputText, setInputText] = useState('');
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
      <ItemsList inputText={inputText} items={data} />
    </>
  );
}

const data: { id: number, text: string }[] = [...Array(100)].map((_, i) => ({
  id: i,
  text: faker.lorem.paragraphs()
}));

const ItemsList = ({ inputText, items }: { inputText: string, items: { id: number, text: string }[] }) => {
  const filteredItems = items.filter(item => item.text.toLowerCase().includes(inputText));

  return (
    <List>
      {filteredItems.map(item => (<ListItem key={item.id} >
        <Box sx={{
          border: 1, mx: 1, px: 2, width: '100%',
        }}>
          <ReactMarkdown>{`Markdown ${item.id}\n\`\`\`\n${item.text}\n\`\`\``}</ReactMarkdown>
        </Box>
      </ListItem>
      ))}
    </List>
  );

};

export default App;
