<?php
/*查询成就记录信息详情的脚本*/
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
$query = "SELECT * FROM Achievement WHERE AchvID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $achvID);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$achv = $result->fetch_all(MYSQLI_ASSOC);
$achvJSON = json_encode($achv, JSON_UNESCAPED_UNICODE);
echo $achvJSON;

//将JSON数据写入文件
// file_put_contents("achv.json", $achvJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>