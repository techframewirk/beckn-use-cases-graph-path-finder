var fs = require("fs")
var construct_tree = require('./graph').construct_tree
var combine_files = require('./graph').combine_files



const start = () => {
    const jsons = fs.readdirSync('./inputs')
    const processed = []
    for(const json of jsons) {
        if(json.endsWith('.json')) {
            console.log(`\nProcessing ${json}`)
            const contents = fs.readFileSync(`./inputs/${json}`, 'utf8')
            response = JSON.parse(contents)
            const csv_text = construct_tree(JSON.parse(contents))
            if (!fs.existsSync('./outputs')){
                fs.mkdirSync('./outputs');
            }
            const file_name = json.slice(0, -4) + 'csv'
            console.log(`Creating file ${file_name}`)
            fs.writeFileSync(`./outputs/${file_name}`, csv_text)
            processed.push(file_name)
        } else {
            console.log(`\nSkipped ${json}. Filename should end with .json`)
        }
    }
    console.log('\nCreating combined csv')
    combine_files(processed);
    console.log('Process complete')
}

start()