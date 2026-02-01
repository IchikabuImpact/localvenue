const express = require('express');
const path = require('path');
const app = express();
const PORT = 8131;

// public ディレクトリを静的ファイルとして公開
const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log(`Serving files from: ${publicPath}`);
});
