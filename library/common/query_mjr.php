<?php
/*查询学院信息的脚本*/
//获取GET请求的数据
$usrRole = $_GET["usrRole"];
$colgAbrv = $_GET["colgAbrv"];

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
    default:
        require_once("../dbuser/temp.php");
        break;
}

//连接数据库
$db = mysqli_connect($dbServer, $dbUser, $dbUserPasswd, $dbName);
if (mysqli_connect_error()) {
    echo "连接数据库时发生错误，请联系管理员并反馈问题";
    exit;
}

//查询学院信息
$query = "SELECT MjrAbrv, MjrName FROM Major WHERE ColgAbrv = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("s", $colgAbrv);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$mjr = $result->fetch_all(MYSQLI_ASSOC);
$mjrJSON = json_encode($mjr, JSON_UNESCAPED_UNICODE);
echo $mjrJSON;

//将学院信息写入JSON文件
// file_put_contents("mjr.json", $mjrJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>