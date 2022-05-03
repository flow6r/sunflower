<?php
/*查询学生提交记录的脚本*/
//获取GET请求的数据
$msID = intval($_GET["msID"]);
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

//查询学生提交记录
$query = "SELECT P.MsID, M.MsName, P.UsrID, U.UsrName, P.CmplDt, P.WrkPath " .
"FROM User AS U, Mission AS M, Progress AS P " .
"WHERE M.MsID = P.MsID AND P.MsID = ? AND P.MsStat = 'cmpled' AND U.UsrID = P.UsrID";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $msID);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$wrks = $result->fetch_all(MYSQLI_ASSOC);
$wrksJSON = json_encode($wrks, JSON_UNESCAPED_UNICODE);
echo $wrksJSON;

//将学院信息写入JSON文件
// file_put_contents("wrks.json", $wrksJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>