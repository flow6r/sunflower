<?php
/*查询成就评论的脚本*/
//获取GET请求的数据
$achvID = intval($_GET["achvID"]);
$usrRole = $_GET["usrRole"];

//引入数据库用户信息脚本
switch ($usrRole) {
    case "std":
        require_once("../dbuser/student.php");
        break;
    case "tch":
        require_once("../dbuser/teacher.php");
        break;
    case "admin":
        require_once("../dbuser/admin.php");
        break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库失败，请联系管理员并反馈问题";
    exit;
}

//查询数据库
$query = "SELECT C.CmtID, C.AchvID, C.CmtTxt, A.UsrID, U.UsrName " .
"FROM User AS U, Achievement AS A, Comment AS C " .
"WHERE A.AchvID = C.AchvID AND C.AchvID = ? AND C.UsrID = U.UsrID";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $achvID);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$cmts = $result->fetch_all(MYSQLI_ASSOC);
$cmtsJSON = json_encode($cmts, JSON_UNESCAPED_UNICODE);
echo $cmtsJSON;

//将JSON数据写入文件
// file_put_contents("cmts.json", $cmtsJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>