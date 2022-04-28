<?php
/*更新课程封面的脚本*/
//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//检查文件上传错误
if ($_FILES["newCover"]["error"] === 1) {
    echo "<script>alert('超出文件上传大小');</script>";
    exit;
}

//检查文件类型并设置后置名
$extName = null;
switch ($_FILES["newCover"]["type"]) {
    case "image/bmp" : $extName = ".bmp"; break;
    case "image/gif" : $extName = ".gif"; break;
    case "image/jpeg": $extName = ".jpg"; break;
    case "image/png" : $extName = ".png"; break;
    default: echo "<script>alert('您上传的图片格式不符合要求，请上传bmp、gif、jpg或png格式的图片文件');</script>"; exit;
}

//获取课程ID和用户角色
session_start();
$crseID = intval($_SESSION["currCrse"]["CrseID"]);
$usrRole = $_SESSION["userInfo"]["UsrRole"];

//将图片文件移动至指定位置
$trgtPath = $docRoot. "/image/crsefront/" . $crseID . $extName;

if (is_uploaded_file($_FILES["newCover"]["tmp_name"])) {
    $imgPath = dir("../../image/crsefront/");
    while (($fileName = $imgPath->read()) != false) {
        if (strstr($fileName, strval($crseID))) unlink($docRoot. "/image/crsefront/" . $fileName);
    }

    if (!move_uploaded_file($_FILES["newCover"]["tmp_name"], $trgtPath)) {
        echo "<script>alert('移动封面图片文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    }
}

//引入数据库用户信息脚本
switch ($usrRole) {
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
    echo "<script>alert('连接数据库失败，请联系管理员并反馈问题');</script>";
    exit;
}

//更新课程封面图片路径信息
$coverPath = "../image/crsefront/" . $crseID . $extName;
$query = "SELECT * FROM Course WHERE CrseID = ?";
$stmt = $db->prepare($query);
$stmt->bind_param("i", $crseID);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows()) {
    $query = "UPDATE Course SET CoverPath = ? WHERE CrseId = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("si", $coverPath, $crseID);
    $stmt->execute();
    echo "<script>alert('成功更新课程封面');</script>";
} else echo "<script>alert('查询课程失败，请联系管理员并反馈问题');</script>";

//释放结果集并关闭链接
$stmt->free_result();
$db->close();
exit;
?>