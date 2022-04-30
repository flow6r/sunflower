<?php
/*查询小组信息详情的脚本*/
//获取GET请求的数据
$ptyID = intval($_GET["ptyID"]);
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
$query = "SELECT P.PtyID, P.PtyName, C.CrseID, C.CrseName, M.UsrID, U.UsrName, M.UsrResp " .
"FROM User AS U, Course AS C, Party AS P, Member AS M " .
"WHERE C.CrseID = P.CrseID AND P.PtyID = ? AND P.PtyID = M.PtyID AND M.UsrID = U.UsrID";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $ptyID);
$stmt->execute();

//将查询结果以JSON数据格式返回给浏览器
$result = $stmt->get_result();
$pty = $result->fetch_all(MYSQLI_ASSOC);
$ptyJSON = json_encode($pty, JSON_UNESCAPED_UNICODE);
echo $ptyJSON;

//将JSON数据写入文件
// file_put_contents("pty.json", $ptyJSON);

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>