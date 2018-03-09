/*
 * Copyright 2018 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package org.tyit.pnc.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Entity
@Table(name = "CODE_SNIPPET")
public class CodeSnippet implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @GeneratedValue(strategy = GenerationType.SEQUENCE)
  @Basic(optional = false)
  @NotNull
  @JsonIgnore
  @Column(name = "ID")
  private Long id;
  @Basic(optional = false)
  @NotNull
  @Lob
  @Column(name = "CODE")
  private String code;
  @Size(max = 255)
  @Basic(optional = false)
  @NotNull
  @Column(name = "TITLE", unique = true)
  private String title;
  @Basic(optional = false)
  @NotNull
  @Column(name = "CREATED_ON")
  @Temporal(TemporalType.TIMESTAMP)
  private Date createdOn;
  @Basic(optional = false)
  @NotNull
  @Column(name = "UPDATED_ON")
  @Temporal(TemporalType.TIMESTAMP)
  private Date updatedOn;
  @JoinColumn(name = "USER_ID", referencedColumnName = "ID")
  @ManyToOne(optional = false)
  private AppUser userId;

  public CodeSnippet(String code, String title, Date createdOn, Date updatedOn, AppUser userId) {
    this.code = code;
    this.title = title;
    this.createdOn = createdOn;
    this.updatedOn = updatedOn;
    this.userId = userId;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getCode() {
    return code;
  }

  public void setCode(String code) {
    this.code = code;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Date getCreatedOn() {
    return createdOn;
  }

  public void setCreatedOn(Date createdOn) {
    this.createdOn = createdOn;
  }

  public Date getUpdatedOn() {
    return updatedOn;
  }

  public void setUpdatedOn(Date updatedOn) {
    this.updatedOn = updatedOn;
  }

  public AppUser getUserId() {
    return userId;
  }

  public void setUserId(AppUser userId) {
    this.userId = userId;
  }
}
