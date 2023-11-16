import path from 'path';
const __dirname = path.resolve();



const config = {
    entry: './src/index.tsx', 
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/, 
                loader: 'ts-loader'
            }, 
            {
                test:/\.css$/, 
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, 'dist'),
        publicPath: "auto"
    }, 
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    }
};

export default config; 