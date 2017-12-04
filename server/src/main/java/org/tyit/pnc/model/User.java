/*
 * Copyright 2017 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.tyit.pnc.model;

import java.io.Serializable;
import java.util.Collection;
import java.util.Date;
import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Entity
@Table(name = "USER")
@NamedQueries({
  @NamedQuery(name = "User.findAll", query = "SELECT u FROM User u")})
public class User implements Serializable {

  private static final long serialVersionUID = 1L;
  @Id
  @Basic(optional = false)
  @NotNull
  @Column(name = "ID")
  private Long id;
  @Basic(optional = false)
  @NotNull
  @Size(min = 1, max = 255)
  @Column(name = "NAME")
  private String name;
  // @Pattern(regexp="[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?", message="Invalid email")//if the field contains email address consider using this annotation to enforce field validation
  @Basic(optional = false)
  @NotNull
  @Size(min = 1, max = 255)
  @Column(name = "EMAIL")
  private String email;
  @Basic(optional = false)
  @NotNull
  @Size(min = 1, max = 255)
  @Column(name = "USERNAME")
  private String username;
  @Basic(optional = false)
  @NotNull
  @Size(min = 1, max = 255)
  @Column(name = "PASSWORD")
  private String password;
  @Basic(optional = false)
  @NotNull
  @Column(name = "CREATED_ON")
  @Temporal(TemporalType.TIMESTAMP)
  private Date createdOn;
  @Basic(optional = false)
  @NotNull
  @Column(name = "LAST_USED_ON")
  @Temporal(TemporalType.TIMESTAMP)
  private Date lastUsedOn;
  @ManyToMany(mappedBy = "userCollection")
  private Collection<Plugin> pluginCollection;
  @ManyToMany(mappedBy = "userCollection")
  private Collection<Role> roleCollection;
  @OneToMany(cascade = CascadeType.ALL, mappedBy = "userId")
  private Collection<Docker> dockerCollection;
  @OneToMany(cascade = CascadeType.ALL, mappedBy = "userId")
  private Collection<Project> projectCollection;
  @OneToOne(cascade = CascadeType.ALL, mappedBy = "userId")
  private DeveloperDetails developerDetails;

  public User() {
  }

  public User(Long id) {
    this.id = id;
  }

  public User(Long id, String name, String email, String username, String password, Date createdOn, Date lastUsedOn) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.username = username;
    this.password = password;
    this.createdOn = createdOn;
    this.lastUsedOn = lastUsedOn;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getUsername() {
    return username;
  }

  public void setUsername(String username) {
    this.username = username;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public Date getCreatedOn() {
    return createdOn;
  }

  public void setCreatedOn(Date createdOn) {
    this.createdOn = createdOn;
  }

  public Date getLastUsedOn() {
    return lastUsedOn;
  }

  public void setLastUsedOn(Date lastUsedOn) {
    this.lastUsedOn = lastUsedOn;
  }

  public Collection<Plugin> getPluginCollection() {
    return pluginCollection;
  }

  public void setPluginCollection(Collection<Plugin> pluginCollection) {
    this.pluginCollection = pluginCollection;
  }

  public Collection<Role> getRoleCollection() {
    return roleCollection;
  }

  public void setRoleCollection(Collection<Role> roleCollection) {
    this.roleCollection = roleCollection;
  }

  public Collection<Docker> getDockerCollection() {
    return dockerCollection;
  }

  public void setDockerCollection(Collection<Docker> dockerCollection) {
    this.dockerCollection = dockerCollection;
  }

  public Collection<Project> getProjectCollection() {
    return projectCollection;
  }

  public void setProjectCollection(Collection<Project> projectCollection) {
    this.projectCollection = projectCollection;
  }

  public DeveloperDetails getDeveloperDetails() {
    return developerDetails;
  }

  public void setDeveloperDetails(DeveloperDetails developerDetails) {
    this.developerDetails = developerDetails;
  }

  @Override
  public int hashCode() {
    int hash = 0;
    hash += (id != null ? id.hashCode() : 0);
    return hash;
  }

  @Override
  public boolean equals(Object object) {
    // TODO: Warning - this method won't work in the case the id fields are not set
    if (!(object instanceof User)) {
      return false;
    }
    User other = (User) object;
    if ((this.id == null && other.id != null) || (this.id != null && !this.id.equals(other.id))) {
      return false;
    }
    return true;
  }

  @Override
  public String toString() {
    return "org.tyit.pnc.model.User[ id=" + id + " ]";
  }

}
