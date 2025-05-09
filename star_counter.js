function cal_github_star(github_id) {
    //1. 读入数据
    //var github_id='guofei9987';
    var url = "https://api.github.com/users/" + github_id + "/repos?page=";
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var a = JSON.parse(this.responseText);
            onePage.push(a);
        }
    };

    var Pages = [];
    for (var i = 1; i < 200; i++) {
        var onePage = [];
        xmlhttp.open("GET", url + i, false);
        xmlhttp.send();
        
        // 修复：检查 onePage[0] 是否存在再访问其 length 属性
        if (!onePage[0] || onePage[0].length == 0) {
            break;
        }
        Pages = Pages.concat(onePage[0]);
    }

    // 如果没有获取到任何数据，返回错误信息
    if (Pages.length === 0) {
        return "无法获取数据，请检查 GitHub ID 是否正确或稍后再试。";
    }

    //2. 提取信息
    repo_list = []
    for (var j = 0; j < Pages.length; j++) {
        if (!Pages[j]['fork']) {//排除fork别人的库
            repo_list.push({
                name: Pages[j]['name'],
                stargazers_count: Pages[j]['stargazers_count'],
                forks_count: Pages[j]['forks_count'],
				html_url: Pages[j]['html_url']
            });
        }
    }


    //排序
    repo_list.sort(function (a, b) {
        return a.stargazers_count - b.stargazers_count
    });
    repo_list.reverse();

    //展示:表头
    table_th = '<style>' +
        'table { border-collapse: collapse; width: 100%; margin: 20px 0; font-family: -apple-system, system-ui, sans-serif; }' +
        'caption { font-size: 1.2em; font-weight: bold; margin-bottom: 10px; color: #333; }' +
        'th { background-color: #42b983; color: white; padding: 12px; text-align: left; }' +
        'td { padding: 10px; border-bottom: 1px solid #eee; }' +
        'tr:hover { background-color: #f5f5f5; }' +
        'a { color: #42b983; text-decoration: none; }' +
        'a:hover { text-decoration: underline; }' +
        'tr:last-child td { border-bottom: none; }' +
        'tr:nth-child(even) { background-color: #f9f9f9; }' +
        '</style>' +
        '<table>' +
        '<tr>' +
        '<th>仓库名称</th>' +
        '<th>点赞数</th>' +
        '<th>引用数</th>' +
        '</tr>';

    table_td = ''
    total_rep = [0, 0]
    for (i = 0; i < repo_list.length; i++) {
        table_td +=
            '<tr>' +
            '<td><a href="' + repo_list[i].html_url + '"'
			    + 'target="' + repo_list[i].name + '">' 
			    + repo_list[i].name + '</a></td>' +
            '<td>' + repo_list[i].stargazers_count + '</td>' +
            '<td>' + repo_list[i].forks_count + '</td>' +
            '</tr>';
        total_rep[0] += repo_list[i].stargazers_count;
        total_rep[1] += repo_list[i].forks_count;
    }



    output = table_th +
        '<tr class="total-row" style="font-weight: bold; background-color:rgb(231, 34, 70); color: black; font-size: 1.1em; text-transform: uppercase; letter-spacing: 1px;">' +
        '<th>总计</th>' +
        '<th>' + total_rep[0] + '</th>' +
        '<th>' + total_rep[1] + '</th>' +
        '</tr>' +
        table_td +
        '</table>';
    return output;
}