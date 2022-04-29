<?php
/*查询课程任务详情的函数*/
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

//查询课程任务信息
$query = "SELECT * FROM Mission WHERE MsID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $msID);
$stmt->execute();

$result = $stmt->get_result();
$ms = $result->fetch_all(MYSQLI_ASSOC);
require_once("../session/curr_ms.php");
if (count($ms) != 0) {
    $msJSON = json_encode($ms, JSON_UNESCAPED_UNICODE);
    echo $msJSON;

    // file_put_contents("ms.json", $msJSON);
} else {
    $err = ["error" => "查询任务详情失败，请联系管理员并反馈问题"];
    $errJSON = json_encode($err, JSON_UNESCAPED_UNICODE);
    echo $errJSON;
}

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>