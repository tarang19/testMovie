import React, { useState } from 'react';
import Header from './compoents/Header';
import Body from './compoents/Body';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('episode'); // Default sorting by 'episode'

  // Handle search query change
  const handleSearch = (query: string) => {
    setSearchQuery(query); 
  };

  // Handle sorting change
  const handleSortChange = (sortMethod: string) => {
    setSortBy(sortMethod); 
  };

  return (
    <>
      <Header onSearch={handleSearch} onSortChange={handleSortChange} />
      <Body searchQuery={searchQuery} sortBy={sortBy} />
    </>
  );
};

export default App;
