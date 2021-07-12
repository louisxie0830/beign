//
//  BuyInputView.swift
//  signing_ios
//
//  Created by Alex on 2019/4/18.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit

protocol BuyInputViewDelegate {
    func backView()
    func nextView()
}

class BuyInputView: UIView, UITableViewDataSource, UITableViewDelegate, TwoButtonCellDelegate {
    var delegate: BuyInputViewDelegate?
    
    let data: [[[String : String]]] = [[["title" : "購買人資訊",
                                      "hint" : "",
                                      "type" : "title",
                                      "sup" : ""],
                                     ["title" : "姓名",
                                      "hint" : "請輸入姓名",
                                      "type" : "cardfield",
                                      "sup" : ""],
                                     ["title" : "手機號碼",
                                      "hint" : "請輸入手機號碼",
                                      "type" : "cardfield",
                                      "sup" : ""],
                                     ["title" : "Email",
                                      "hint" : "請輸入Email",
                                      "type" : "cardfield",
                                      "sup" : ""],
                                     ["title" : "通訊地址",
                                      "hint" : "請輸入通訊地址",
                                      "type" : "cardfield",
                                      "sup" : ""]],
                                       [["title" : "發票資訊",
                                         "hint" : "",
                                         "type" : "title",
                                         "sup" : ""],
                                        ["title" : "公司 - 三聯式發票",
                                         "hint" : "",
                                         "type" : "title_sup",
                                         "sup" : ""],
                                        ["title" : "發票抬頭",
                                         "hint" : "請輸入發票抬頭",
                                         "type" : "cardfield",
                                         "sup" : ""],
                                        ["title" : "統一編號",
                                         "hint" : "請輸入統一編號",
                                         "type" : "cardfield",
                                         "sup" : ""],
                                        ["title" : "根據財政部「電子發票實施作業要點」，於消費開立「三聯電子發票」不主動寄送，簽署王亦會將發票號碼上傳至政府平台。",
                                         "hint" : "",
                                         "type" : "sup",
                                         "sup" : ""]]]
    
    
    @IBOutlet weak var tableView: UITableView!
    
    override func awakeFromNib() {
        super.awakeFromNib()//CardTwoButton
        tableView.register(UINib(nibName: "CardTitleCell", bundle: nil), forCellReuseIdentifier: "CardTitleCell")
        tableView.register(UINib(nibName: "CardFieldCell", bundle: nil), forCellReuseIdentifier: "CardFieldCell")
        tableView.register(UINib(nibName: "CardLabelCell", bundle: nil), forCellReuseIdentifier: "CardLabelCell")
        tableView.register(UINib(nibName: "CardSupCell", bundle: nil), forCellReuseIdentifier: "CardSupCell")
        tableView.register(UINib(nibName: "CardTwoButton", bundle: nil), forCellReuseIdentifier: "CardTwoButton")
        tableView.register(UINib(nibName: "CardFooterView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardFooterView")
        tableView.register(UINib(nibName: "CardHeaderView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardHeaderView")
    }
    public func numberOfSections(in tableView: UITableView) -> Int {
        return data.count + 1
    }
    
    public func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        if section < 2  {
            return 24.0
        }
        else {
            return 0
        }
    }
    
    public func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        if section < 2 {
            return 20.0
        }
        else {
            return 0
        }
    }
    
    public func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        if section < 2 {
            let headerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: "CardHeaderView") as! CardHeaderView
            return headerView
        }
        else {
            return nil
        }
    }
    
    public func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        if section < 2 {
            let footerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: "CardFooterView") as! CardFooterView
            return footerView
        }
        else {
            return nil
        }
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if section < 2 {
            return data[section].count
        }
        else {
            return 1
        }
    }
    
    public func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return UITableView.automaticDimension
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        if indexPath.section < 2 {
            let object: Dictionary = data[indexPath.section][indexPath.row]
            if object["type"] == "title" {
                let cell = tableView.dequeueReusableCell(withIdentifier: "CardTitleCell", for: indexPath) as! CardTitleCell
                cell.titleLabel.text = object["title"]
                return cell
            }
            else if object["type"] == "cardfield" {
                let cell = tableView.dequeueReusableCell(withIdentifier: "CardFieldCell", for: indexPath) as! CardFieldCell
                
                cell.titleLabel.text = object["title"]!
                cell.textField.placeholder = object["hint"]
                cell.supLabel.text = object["sup"]
                
                cell.setupUI(type: object["type"]!)
                return cell;
            }
            else if object["type"] == "title_sup" {
                let cell = tableView.dequeueReusableCell(withIdentifier: "CardLabelCell", for: indexPath) as! CardLabelCell
                cell.countLabel.isHidden = true
                cell.titleLabel.text = object["title"]
                cell.titleLabel.s()
                return cell
            }
            else {
                let cell = tableView.dequeueReusableCell(withIdentifier: "CardSupCell", for: indexPath) as! CardSupCell
                cell.titleLabel.text = object["title"]
                cell.titleLabel.sizeToFit()
                return cell
            }
        }
        else {
            let cell = tableView.dequeueReusableCell(withIdentifier: "CardTwoButton", for: indexPath) as! CardTwoButton
            cell.delegate = self
            return cell
        }
    }
    
    func nextButtonEvent() {
        delegate?.nextView()
    }
    
    func backButtonEvent() {
        delegate?.backView()
    }
}
