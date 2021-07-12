//
//  LoginViewController.swift
//  signing_ios
//
//  Created by Alex on 2019/3/21.
//  Copyright © 2019年 Rock Chen. All rights reserved.
//

import UIKit
import Material
import KRProgressHUD
import RxSwift
import RxCocoa

class LoginViewController: UIViewController {
    let disposed = DisposeBag()
    let viewModel = LoginViewModel()
    
    @IBOutlet weak var tableView: UITableView!
    
    @IBOutlet weak var loginButton: RaisedButton! {
        didSet {
            loginButton.title = "login".localized()
            loginButton.aquaFill()
            loginButton.disable = false
        }
    }
    fileprivate var menuButton: IconButton!
    @IBOutlet weak var forgetButton: RaisedButton! {
        didSet {
            forgetButton.title = "forget_password".localized();
            forgetButton.nonBoder()
        }
    }
    
    deinit {
        print("deinit")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        setup()
        bind()
    }
    
    func setup() {
        navigationItem.titleLabel.text = "being_protocol_service".localized()
        tableView.register(UINib(nibName: "CardFieldCell", bundle: nil), forCellReuseIdentifier: "CardFieldCell")
        tableView.register(UINib(nibName: "CardHeaderView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardHeaderView")
        tableView.register(UINib(nibName: "CardFooterView", bundle: nil), forHeaderFooterViewReuseIdentifier: "CardFooterView")

        loginButton.rx.tap.subscribe(onNext: {
            self.login()
        }).disposed(by: disposed)
        
        forgetButton.rx.tap.subscribe(onNext: {
            self.performSegue(withIdentifier: "ForgetSegue", sender: nil)
        }).disposed(by: disposed)
    }
    
    private func bind() {
        viewModel.dataSource.asObservable().bind(to: tableView.rx.items(cellIdentifier: "CardFieldCell", cellType: CardFieldCell.self)) { [unowned self] (row, data, cell) in
            
            cell.setupUI(type: data.type)
            cell.titleLabel.text = data.title
            cell.textField.placeholder = data.hint
            cell.errorLabel.text = data.errorMessage
            
            if data.identifier == "email" {
                cell.textField.rx.text.orEmpty.bind(to: self.viewModel.email).disposed(by: cell.disposed)
            }
            if data.identifier == "password" {
                cell.textField.rx.text.orEmpty.bind(to: self.viewModel.password).disposed(by: cell.disposed)
            }
            
        }.disposed(by: disposed)
        
        viewModel.isSuccess.asObservable().bind { [weak self] (value) in
            if value == true {
                self?.indexPage()
            }
        }.disposed(by: disposed)
        
        viewModel.errorMessage.asObservable().bind { (value) in
            KRProgressHUD.showMessage(value)
        }.disposed(by: disposed)
        
        viewModel.isLoading.asObservable().bind { (value) in
            if value == true {
                KRProgressHUD.show()
            }
            else {
                KRProgressHUD.dismiss()
            }
        }.disposed(by: disposed)
        
        viewModel.token.asObservable().bind { (value) in
            TokenSource.shared.token = value
        }.disposed(by: disposed)
    }
    
    fileprivate func login() {
        if (viewModel.validate() == false) {
            tableView.reloadData()
        }
        else {
            viewModel.login()
        }
    }
    
    fileprivate func indexPage() {
        menuButton = IconButton(image: UIImage(named: "baseline_menu_white_24pt"), tintColor: UIColor.dark40)
        let indexViewController: IndexViewController = storyboard?.instantiateViewController(withIdentifier: "IndexViewController") as! IndexViewController
        let leftViewController: LeftViewController = storyboard?.instantiateViewController(withIdentifier: "LeftViewController") as! LeftViewController

        let nav: AppNavigationController = AppNavigationController.init(rootViewController: indexViewController)
        leftViewController.navController = nav
        let vc = nav.viewControllers[0]
        vc.navigationItem.leftViews = [menuButton]

        let navigationDrawerController: NavigationDrawerController = NavigationDrawerController.init(rootViewController: nav, leftViewController: leftViewController, rightViewController: nil)

        menuButton.rx.tap.subscribe(onNext: {
            navigationDrawerController.toggleLeftView()
        }).disposed(by: disposed)

        let window: UIWindow = ((UIApplication.shared.delegate?.window)!)!
        window.rootViewController = navigationDrawerController

        UIView.transition(with: window,
                          duration: 0.3,
                          options: UIView.AnimationOptions.transitionCrossDissolve,
                          animations: nil,
                          completion: nil)
    }
}

extension LoginViewController: UITableViewDelegate {
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
}
