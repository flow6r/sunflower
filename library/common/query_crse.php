<?php
/*查询课程信息的脚本*/
//获取GET请求的数据
$crseID = intval($_GET["crseID"]);
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
$query = "SELECT C.CrseID, C.CrseName, C.CrseDesc, C.CoverPath, C.UsrID, U.UsrName " .
"FROM Course AS C, User AS U WHERE C.CrseID = ? AND C.UsrID = U.UsrID";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $crseID);
$stmt->execute();

$result = $stmt->get_result();
$crse = $result->fetch_all(MYSQLI_ASSOC);
require_once("../session/curr_crse.php");
if (count($crse) != 0) {
    $crseJSON = json_encode($crse, JSON_UNESCAPED_UNICODE);
    echo $crseJSON;

    // file_put_contents("crse.json", $crseJSON);
} else {
    $err = ["error" => "查询课程失败，请联系管理员并反馈问题"];
    $errJSON = json_encode($err, JSON_UNESCAPED_UNICODE);
    echo $errJSON;
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>