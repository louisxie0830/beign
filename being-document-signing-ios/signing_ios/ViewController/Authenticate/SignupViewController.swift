//
//  SignupViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/3/27.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import RxSwift

class SignupViewController: UIViewController, UITableViewDelegate, UITableViewDataSource, CardBoxCellDelegate {
    let disposed = DisposeBag()
    let data: [[String : String]] = [["title" : "name".localized(),
                                      "hint" : "please_input_real_name".localized(),
                                      "type" : "cardfield",
                                      "sup" : ""],
                                     ["title" : "contact_number".localized(),
                                      "hint" : "please_input_contact_number".localized(),
                                      "type" : "cardfield",
                                      "sup" : ""],
                                     ["title" : "email".localized(),
                                      "hint" : "please_input_email".localized(),
                                      "type" : "cardfield",
                                      "sup" : ""],
                                     ["title" : "password".localized(),
                                      "hint" : "please_input_password".localized(),
                                      "type" : "cardfield",
                                      "sup" : "8-32_password".localized()],
                                     ["title" : "confirm_password".localized(),
                                      "hint" : "please_input_password_again".localized(),
                                      "type" : "cardfield",
                                      "sup" : ""],
                                     ["title" : "credential_password".localized(),
                                      "hint" : "please_input_credential_password".localized(),
                                      "type" : "problem",
                                      "sup" : "8-32_password".localized()],
                                     ["title" : "verify_code".localized(),
                                      "hint" : "please_input_verify_code".localized(),
                                      "type" : "button",
                                      "sup" : ""],
                                     ["type" : "box",
                                      "sup" : ""]]
    var isAgreeTerms: Bool!
    
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var signupButton: RaisedButton! {
        didSet {
            signupButton.aquaFill()
            signupButton.disable = true
        }
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setup()

        // Do any additional setup after loading the view.
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        if let nav = navigationController {
            nav.setNavigationBarHidden(false, animated: true)
        }
    }
    
    func setup() {
        navigationItem.titleLabel.text = "being_protocol_service".localized()
        tableView.register(UINib(nibName: "CardFieldCell", bundle: nil), forCellReuseIdentifier: "CardFieldCell")
        tableView.register(UINib(nibName: "CardButtonCell", bundle: nil), forCellReuseIdentifier: "CardButtonCell")
        tableView.register(UINib(nibName: "CardBoxCell", bundle: nil), forCellReuseIdentifier: "CardBoxCell")
        tableView.register(UINib(nibName: "CardHeaderView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardHeaderView")
        tableView.register(UINib(nibName: "CardFooterView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardFooterView")
        
        signupButton.rx.tap.subscribe(onNext: {
            
        }).disposed(by: disposed)
    }
    
    func touch(type: String) {
        let viewController = storyboard?.instantiateViewController(withIdentifier: "TermsViewController") as! TermsViewController
        viewController.type = type
        navigationController?.pushViewController(viewController, animated: true)
        
    }
    
    func agree(isAgree: Bool) {
        isAgreeTerms = isAgree
        print(isAgree)
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
            
        else if type == "box" {
            let cell = tableView.dequeueReusableCell(withIdentifier: "CardBoxCell", for: indexPath) as! CardBoxCell
            cell.delegate = self
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
