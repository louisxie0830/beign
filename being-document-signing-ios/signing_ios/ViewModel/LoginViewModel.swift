//
//  LoginViewModel.swift
//  signing_ios
//
//  Created by Rock Chen on 2019/4/19.
//  Copyright © 2019 Rock Chen. All rights reserved.
//

import Foundation
import RxCocoa
import RxSwift

class LoginViewModel {
    let disposebag = DisposeBag()
    let dataSource = Variable<[InputData]>([])
    let email = Variable<String>("")
    let password = Variable<String>("")
    let isSuccess = Variable<Bool>(false)
    let isLoading = Variable<Bool>(false)
    var errorMessage = Variable<String>("")
    let token =  Variable<String>("")
    
    init() {
        let emailData = InputData()
        emailData.title = "email".localized()
        emailData.hint = "please_input_email".localized()
        emailData.type = "cardfield"
        emailData.identifier = "email"
        
        let passwordData = InputData()
        passwordData.title = "password".localized()
        passwordData.hint = "please_input_password".localized()
        passwordData.type = "cardfield"
        passwordData.identifier = "password"
        
        dataSource.value = [emailData, passwordData]
    }
    
    func validate() -> Bool {
        let emailValid = email.value.regex("[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}")
        let passwordValid = password.value.regex("^([a-zA-Z]+\\d+|\\d+[a-zA-Z]+)[a-zA-Z0-9]*$")
        
        dataSource.value.first?.errorMessage = (emailValid == true) ? "" : "Email格式錯誤"
        dataSource.value.last?.errorMessage = (passwordValid == true) ? "" : "請輸入8-32位英數"
        return emailValid && passwordValid
    }
    
    func login() {
        let request = LoginRequest(email: email.value, password: password.value)
        
        self.isLoading.value = true
        
        authProvider.rx.request(.login(request)).subscribe {  event in
            switch event {
            case let .success(response):
                do {
                    let model = try response.mapObject(_type: Login.self)
                    
                    self.isLoading.value = false
                    self.isSuccess.value = (model.code == 200)
                    self.token.value = model.token
                }
                catch(let error) {
                    self.isLoading.value = false
                    self.isSuccess.value = false
                    self.errorMessage.value = error.localizedDescription
                }
            case let .error(error):
                self.isLoading.value = false
                self.isSuccess.value = false
                self.errorMessage.value = error.localizedDescription
            }
        }.disposed(by: disposebag)
    }
}
