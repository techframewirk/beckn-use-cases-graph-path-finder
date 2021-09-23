var find = require("lodash").find
var filter = require("lodash").filter
var fs = require("fs")

const order_by = ["search", "on_search", "select", "on_select", "init", "on_init", "confirm", "on_confirm", "status", "on_status", "track", "on_track", "update", "on_update", "cancel", "on_cancel", "rating", "on_rating", "support", "on_support"]

const createRowText = (row) => {
    const use_cases = []
    for(const item in row) {
        const action = row[item].split(' ')[0]
        use_cases[action] = row[item].split(' ').slice(1).join(' ')
    }
    row_text = ''
    for(const item of order_by) {
        if(use_cases[item] !== undefined) {
            row_text = row_text + use_cases[item]
        }
        row_text = row_text + '\t'
    }
    return row_text;
}

function traverse(node, response, path = [], result = []) {
    if (!node.children.length)
        result.push(path.concat(`${node.call} ${node.label}`))
    for (const child of node.children) {
        child_obj = find(response.use_cases, { id: child })
        traverse(child_obj, response, path.concat(`${node.call} ${node.label}`), result)
    }
    return result;
}

const construct_tree = (response) => {
    use_cases = response.use_cases
    roots = filter(response.use_cases, function (o) {
        return !o.parents.length
    })
    tree = []
    for (root of roots) {
        tree = tree.concat(traverse(root, response))
    }
    console.log(`${response.participant_name} ${response.organisation_name} ${response.role_in_network}`)
    console.log(`${tree.length} paths found. Creating csv...`)
    csv_text = 'participant_details \t' + order_by.join('\t')
    for(row of tree) {
        csv_text = csv_text + `\n${response.participant_name}_${response.organisation_name}_${response.role_in_network}\t` + createRowText(row)
    }
    return csv_text;
}

const combine_files = (files) => {
    csv_text = 'participant_details \t' + order_by.join('\t') + '\n'
    for(const file_name of files) {
        var contents = fs.readFileSync(`./outputs/${file_name}`, 'utf8')
        contents = contents.split('\n').slice(1).join('\n')
        csv_text = csv_text + contents + `\n`;
    }
    fs.writeFileSync('./outputs/combined.csv', csv_text)
}


module.exports.construct_tree = construct_tree

module.exports.combine_files = combine_files