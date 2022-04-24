<?php
/*批量导入学生用户记录的脚本*/
//使用命名空间
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Reader\Xls;

//引入PHPSpreadsheet文件
require_once("../PHPSpreadsheet/vendor/autoload.php");

//获取文档根目录
$docRoot = $_SERVER["DOCUMENT_ROOT"];

//获取当前时间信息
$currDateTime = date("_YmdHis");

//检查文件类型
if (
    $_FILES["usrInfoTmplFile"]["type"] != "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    && $_FILES["usrInfoTmplFile"]["type"] != "application/vnd.ms-excel"
) {
    echo "<script>alert('请上传xls或xlsx格式的学生用户信息文件');</script>";
    exit;
}

//获取当前用户的姓名和角色信息
session_start();
$usrRole = $_SESSION["userInfo"]["UsrRole"];
$usrName = $_SESSION["userInfo"]["UsrName"];

//设置文件基本名
$baseName = "StdUsrInfoTmpl_" . $usrName . $currDateTime;

//设置文件后缀名
$extName = null;
if ($_FILES["usrInfoTmplFile"]["type"] === "application/vnd.ms-excel") $extName = ".xls";
else $extName = ".xlsx";

//设置文件路径
$newStdUsrsInfoFile = $docRoot . "/data/upload/" . $baseName . $extName;

//移动文件至指定目录
if (is_uploaded_file($_FILES["usrInfoTmplFile"]["tmp_name"])) {
    if (!move_uploaded_file($_FILES["usrInfoTmplFile"]["tmp_name"], $newStdUsrsInfoFile)) {
        echo "<script>alert('移动学生用户信息文件时发生错误，请联系管理员并反馈问题');</script>";
        exit;
    }
}

//尝试读取文件
if ($extName === ".xls") $readFile = new Xls();
else $readFile = new Xlsx();
$spreadsheet = $readFile->load($newStdUsrsInfoFile);
$newStdUsrsInfo = $spreadsheet->getActiveSheet(0);

//获取数据行数
$dataRows = $newStdUsrsInfo->getHighestRow() - 3;
$begnRows = 4;

//声明学生用户信息数组
$newStdUsrsInfoAray = array();

//声明无法插入的学生用户信息数组
$canIsrt = true;
$cantIsrtUsrInfoAray = array();
$cantIsrtUsrInfoIndx = 0;

//遍历数据表，读取数据
for ($indx = 0; $indx < $dataRows; $indx++, $begnRows++) {
    $newStdUsrsInfoAray[$indx]["UsrID"] = $newStdUsrsInfo->getCellByColumnAndRow(1, $begnRows)->getValue();
    $newStdUsrsInfoAray[$indx]["UsrName"] = $newStdUsrsInfo->getCellByColumnAndRow(2, $begnRows)->getValue();
    $newStdUsrsInfoAray[$indx]["UsrPasswd"] = password_hash("std" . $newStdUsrsInfoAray[$indx]["UsrID"], PASSWORD_BCRYPT);
    $newStdUsrsInfoAray[$indx]["UsrGen"] = $newStdUsrsInfo->getCellByColumnAndRow(3, $begnRows)->getValue();
    $newStdUsrsInfoAray[$indx]["UsrGen"] = ($newStdUsrsInfoAray[$indx]["UsrGen"] === "男" ? "male" : "female");
    $newStdUsrsInfoAray[$indx]["UsrRole"] = "std";
    $newStdUsrsInfoAray[$indx]["UsrEmail"] = $newStdUsrsInfo->getCellByColumnAndRow(4, $begnRows)->getValue();
    $newStdUsrsInfoAray[$indx]["UsrAdms"] = intval($newStdUsrsInfo->getCellByColumnAndRow(5, $begnRows)->getValue());
    $newStdUsrsInfoAray[$indx]["ColgAbrv"] = $newStdUsrsInfo->getCellByColumnAndRow(6, $begnRows)->getValue();
    $newStdUsrsInfoAray[$indx]["MjrAbrv"] = $newStdUsrsInfo->getCellByColumnAndRow(7, $begnRows)->getValue();
    $newStdUsrsInfoAray[$indx]["AvatarPath"] = null;
}

//将数据保存为JSON格式并写入文件
// $stdUsrs = json_encode($newStdUsrsInfoAray, JSON_UNESCAPED_UNICODE);
// file_put_contents("stdUsrs.json", $stdUsrs);

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

//查询数据库检查用户是否存在
for ($indx = 0; $indx < count($newStdUsrsInfoAray); $indx++) {
    $query = "SELECT UsrID, UsrEmail FROM User WHERE UsrID = ? OR UsrEmail = ?";
    $stmt = $db->prepare($query);
    $stmt->bind_param("ss", $newStdUsrsInfoAray[$indx]["UsrID"], $newStdUsrsInfoAray[$indx]["UsrEmail"]);
    $stmt->execute();
    $stmt->store_result();
    if ($stmt->num_rows()) {
        $canIsrt = false;
        $stmt->bind_result($UsrID, $UsrEmail);
        $stmt->fetch();
        $cantIsrtUsrInfoAray[$cantIsrtUsrInfoIndx]["UsrID"] = $UsrID;
        if ($newStdUsrsInfoAray[$indx]["UsrID"] === $UsrID) 
            $cantIsrtUsrInfoAray[$cantIsrtUsrInfoIndx++]["ErrTxt"] = "该用户已存在";
        else $cantIsrtUsrInfoAray[$cantIsrtUsrInfoIndx++]["ErrTxt"] = "该电子邮箱已被绑定";
    }
    $stmt->free_result();
}

//插入数据或提示错误信息
if ($canIsrt) {
    for ($indx = 0; $indx < count($newStdUsrsInfoAray); $indx++) {
        $query = "INSERT INTO User VALUES (?,?,?,?,?,?,?,?,?,?)";
        $stmt = $db->prepare($query);
        $stmt->bind_param(
            "ssssssisss",
            $newStdUsrsInfoAray[$indx]["UsrID"],
            $newStdUsrsInfoAray[$indx]["UsrName"],
            $newStdUsrsInfoAray[$indx]["UsrPasswd"],
            $newStdUsrsInfoAray[$indx]["UsrGen"],
            $newStdUsrsInfoAray[$indx]["UsrRole"],
            $newStdUsrsInfoAray[$indx]["UsrEmail"],
            $newStdUsrsInfoAray[$indx]["UsrAdms"],
            $newStdUsrsInfoAray[$indx]["ColgAbrv"],
            $newStdUsrsInfoAray[$indx]["MjrAbrv"],
            $newStdUsrsInfoAray[$indx]["AvatarPath"],
        );
        $stmt->execute();
    }

    echo "<script>alert('成功导入" . $dataRows . "条学生用户记录');</script>";
} else {
    $tips = null;
    for ($indx = 0; $indx < count($cantIsrtUsrInfoAray); $indx++)
        $tips .= "\\n用户ID：" . $cantIsrtUsrInfoAray[$indx]["UsrID"] . "，错误原因：" . $cantIsrtUsrInfoAray[$indx]["ErrTxt"];
    echo "<script>alert('您导入的信息中包含已存在的用户记录" . $tips . "\\n请检查无误后再执行批量导入的操作');</script>";
    unlink($newStdUsrsInfoFile);
}

//关闭链接
$db->close();
exit;
?>