//
//  EditCertViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/4/2.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxSwift
import RxCocoa

class EditCertViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    let disposed = DisposeBag()
    var data: [[String : String]] = [["title" : "credential_password".localized(),
                                      "hint" : "please_input_credential_password".localized(),
                                      "type" : "problem",
                                      "sup" : "8-32_password".localized()],
                                     ["title" : "confirm_credential_password".localized(),
                                      "hint" : "please_input_credential_password_again".localized(),
                                      "type" : "cardfield",
                                      "sup" : ""],
                                     ["title" : "verify_code".localized(),
                                      "hint" : "please_input_verify_code".localized(),
                                      "type" : "button",
                                      "sup" : ""]]
    
    var type: String = "cert"
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var sendButton: RaisedButton! {
        didSet {
            sendButton.aquaFill()
            sendButton.disable = true
            sendButton.title = "edit_cert_password".localized()
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()
        // Do any additional setup after loading the view.
    }
    
    private func setup() {
        if type != "cert" {
            data = [["title" : "password".localized(),
                     "hint" : "please_input_password".localized(),
                     "type" : "cardfield",
                     "sup" : "8-32_password".localized()],
                    ["title" : "confirm_password".localized(),
                     "hint" : "please_input_password_again".localized(),
                     "type" : "cardfield",
                     "sup" : ""],
                    ["title" : "verify_code".localized(),
                     "hint" : "please_input_verify_code".localized(),
                     "type" : "button",
                     "sup" : ""]]
            sendButton.title = "edit_password".localized()
        }
        
        tableView.register(UINib(nibName: "CardFieldCell", bundle: nil), forCellReuseIdentifier: "CardFieldCell")
        tableView.register(UINib(nibName: "CardButtonCell", bundle: nil), forCellReuseIdentifier: "CardButtonCell")
        tableView.register(UINib(nibName: "CardHeaderView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardHeaderView")
        tableView.register(UINib(nibName: "CardFooterView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardFooterView")
        
        sendButton.rx.tap.subscribe(onNext: {
            
        }).disposed(by: disposed)
    }
    
    public func numberOfSections(in tableView: UITableView) -> Int {
        return 1
    }
    
    public func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 24.0
    }
    
    public func tableView(_ tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 20.0
    }
    
    public func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let headerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: "CardHeaderView") as! CardHeaderView
        return headerView
    }
    
    public func tableView(_ tableView: UITableView, viewForFooterInSection section: Int) -> UIView? {
        let footerView = tableView.dequeueReusableHeaderFooterView(withIdentifier: "CardFooterView") as! CardFooterView
        return footerView
        
    }
    
    public func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return data.count
    }
    
    public func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let dict = data[indexPath.row]
        
        let type: String = dict["type"]!
        
        if type == "button" {
            let cell = tableView.dequeueReusableCell(withIdentifier: "CardButtonCell", for: indexPath) as! CardButtonCell
            
            cell.titleLabel.text = dict["title"]!
            cell.textField.placeholder = dict["hint"]
            
            cell.textField.rx.value.subscribe(onNext: { value in
                print(value!)
            }).disposed(by: disposed)
            
            cell.cardButton.rx.tap.subscribe(onNext: {
                
            }).disposed(by: disposed)
            
            return cell
        }
        else {
            let cell = tableView.dequeueReusableCell(withIdentifier: "CardFieldCell", for: indexPath) as! CardFieldCell
            
            cell.titleLabel.text = dict["title"]!
            cell.textField.placeholder = dict["hint"]
            cell.supLabel.text = dict["sup"]
            
            cell.setupUI(type: type)
            cell.textField.rx.value.subscribe(onNext: { value in
                print(value!)
            }).disposed(by: disposed)
            
            cell.problemButton.rx.tap.subscribe(onNext: {
                
            }).disposed(by: disposed)
            
            return cell;
        }
        
    }

}
