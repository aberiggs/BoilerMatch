// ReadReceiptContext.js
import React, { createContext, useContext, useState } from 'react';

const ReadReceiptsContext = createContext();

export const ReadReceiptsProvider = ({ children }) => {
  const [readReceiptsEnabled, setReadReceiptsEnabled] = useState(false);

  return (
    <ReadReceiptsContext.Provider value={{ readReceiptsEnabled, setReadReceiptsEnabled }}>
      {children}
    </ReadReceiptsContext.Provider>
  );
};

export const useReadReceipts = () => {
  return useContext(ReadReceiptsContext);
};

export default ReadReceiptsProvider;
