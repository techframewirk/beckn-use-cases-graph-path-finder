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
            construct_tree(JSON.parse(contents))
            processed.push(json)
        } else {
            console.log(`Skipped ${json}. Filename should end with .json`)
        }
    }
    console.log('\nCreating combined csv')
    combine_files(processed);
    console.log('Process complete')
}

start()